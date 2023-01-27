import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const useAuth = () => {
  let userInfo = useState('stateUserInfo', () => null);

  // -- 新規会員データの箱 -------------- //
  let tempUserData = {
    uid: '',
    email: '',
    displayName: 'no name',
    description: '',
    token: '',
    favorite: [],
  };

  // --------------------------------------------------
  // Email SignUP
  // --------------------------------------------------
  const createUser = async (values) => {
    console.log('createUser', values);

    const auth = getAuth();

    await createUserWithEmailAndPassword(auth, values.data.email, values.data.password)
      .then((userCredential) => {
        const token = userCredential.user.accessToken;
        const user = userCredential.user;
        console.log('登録', user.uid);

        tempUserData.token = token;
        tempUserData.uid = user.uid;
        tempUserData.email = user.email;
      })
      .catch((error) => {
        console.log(error);
        console.log('firebaseError: ', error.code);
        if (error.code === 'auth/email-already-in-use') {
          console.log('このメールアドレスは使用されています');
        } else {
          console.log('エラー:', error.code);
        }
        // switch (error.code) {
        //   case 'auth/cancelled-popup-request':
        //   case 'auth/popup-closed-by-user':
        //     return null;
        //   case 'auth/email-already-in-use':
        //     if (method.indexOf('signup') !== -1) {
        //       return 'このメールアドレスは使用されています';
        //     } else {
        //       return 'メールアドレスまたはパスワードが違います';
        //     }
        //   case 'auth/invalid-email':
        //     return 'メールアドレスの形式が正しくありません';
        //   case 'auth/user-disabled':
        //     return 'サービスの利用が停止されています';
        //   case 'auth/user-not-found':
        //     return 'メールアドレスまたはパスワードが違います';
        //   case 'auth/user-mismatch':
        //     if (method === 'signin/popup') {
        //       return '認証されているユーザーと異なるアカウントが選択されました';
        //     } else {
        //       return 'メールアドレスまたはパスワードが違います';
        //     }
        //   case 'auth/weak-password':
        //     return 'パスワードは6文字以上にしてください';
        //   case 'auth/wrong-password':
        //     return 'メールアドレスまたはパスワードが違います';
        //   case 'auth/popup-blocked':
        //     return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください';
        //   case 'auth/operation-not-supported-in-this-environment':
        //   case 'auth/auth-domain-config-required':
        //   case 'auth/operation-not-allowed':
        //   case 'auth/unauthorized-domain':
        //     return '現在この認証方法はご利用頂けません';
        //   case 'auth/requires-recent-login':
        //     return '認証の有効期限が切れています';
        //   default:
        //     if (method.indexOf('signin') !== -1) {
        //       return '認証に失敗しました。しばらく時間をおいて再度お試しください';
        //     } else {
        //       return 'エラーが発生しました。しばらく時間をおいてお試しください';
        //     }
        // }
      });

    const data = await $fetch('/api/auth', {
      method: 'post',
      body: { mode: values.mode, data: tempUserData },
    }); // そのままリターンしないとエラー
    userInfo.value = { ...data };
    console.log('userInfo.value', userInfo.value);
  };

  // --------------------------------------------------
  // Email Login
  // --------------------------------------------------
  const loginUser = async (values) => {
    console.log('loginUser', values);
    const auth = getAuth();
    let tempUser = {};

    await signInWithEmailAndPassword(auth, values.data.email, values.data.password)
      .then((userCredential) => {
        tempUser.token = userCredential.user.accessToken;
        tempUser.data = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
        console.log('firebaseError: ', error.code);
        if (error.code === 'auth/email-already-in-use') {
          console.log('このメールアドレスは使用されています');
        } else {
          console.log('エラー:', error.code);
        }
      });
    if (tempUser) {
      const data = await $fetch('/api/auth', {
        method: 'post',
        body: { mode: values.mode, data: tempUser.data },
      });
      userInfo.value = { ...data };
      userInfo.value.id = data.data.id; // index付与
      console.log('userInfo.value', userInfo.value);
    }
  };

  // --------------------------------------------------
  // signInSignUpGoogle
  // --------------------------------------------------
  const signInSignUpGoogle = async () => {
    console.log('signInSignUpGoogle');
    let token = '';
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          token = credential.accessToken;
          console.log(result.user);
          console.log(`登録orログインユーザー id: ${token} uid: ${result.user.uid}`);

          tempUserData.token = token;
          tempUserData.uid = result.user.uid;
          tempUserData.email = result.user.email;
          tempUserData.displayName = result.user.displayName;
        })
        .catch((error) => {
          console.log(error);
        });
      const data = await $fetch('/api/auth', { method: 'post', body: tempUserData });
      userInfo.value = { ...data };
      userInfo.value.id = data.data.id; // index付与

      console.log('userInfo.value', userInfo.value);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------
  // logoutUser
  // --------------------------------------------------
  const logoutUser = async () => {
    const auth = getAuth();
    await firebaseSignOut(auth)
      .then(() => {
        userInfo.value = null;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return {
    createUser,
    loginUser,
    logoutUser,
    signInSignUpGoogle,
    userInfo,
  };
};
export default useAuth;
