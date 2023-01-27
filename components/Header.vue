<script setup>
import {
  // TabGroup,
  // TabList,
  // Tab,
  // TabPanels,
  // TabPanel,
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { ElMessageBox } from 'element-plus';

// --------------------------------------------------
// composables
// --------------------------------------------------
// const { dataLinks, createLink, updateLink, deleteLink } = useLinks();
const { createUser, loginUser, logoutUser, userInfo, signInSignUpGoogle } = useAuth();

// --------------------------------------------------
// modal
// --------------------------------------------------
const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

// --------------------------------------------------
// Dialog
// --------------------------------------------------
const dialogVisible = ref(false);

// --------------------------------------------------
// loginForm
// --------------------------------------------------

// -- state -------------- //
const isLoginTab = ref(false);
const loginVal = reactive([{ displayName: '', email: '', password: '' }]);

const onLogin = async (props) => {
  if (props.mode === 'login') {
    // -- email login -------------- //
    console.log('ログインです');
    if (loginVal.email !== '' && loginVal.password !== '') {
      let values = {};
      values.data = {
        email: loginVal.email,
        password: loginVal.password,
      };
      values.mode = props.mode;
      await loginUser(values);
      console.log('どうよ', userInfo?.value);
      // resetLoginForm();
    }
  } else if (props.mode === 'register') {
    // -- email register -------------- //
    console.log('新規登録です');
    if (loginVal.email !== '' && loginVal.password !== '') {
      // 本番は正規表現でパスワードチェックが望ましい
      // https://qiita.com/iLLviA/items/b6bf680cd2408edd050f

      let values = {};
      values.data = {
        email: loginVal.email,
        password: loginVal.password,
      };
      values.mode = props.mode;

      await createUser(values);
      resetLoginForm();
    }
  } else {
    // -- Google認証 -------------- //
    await signInSignUpGoogle();
  }
};
const resetLoginForm = () => {
  loginVal.displayName = '';
  loginVal.email = '';
  loginVal.password = '';
};
const onLogout = () => {
  logoutUser();
};
</script>

<template>
  <div>
    <div class="py-3 px-6" v-if="!userInfo">
      <template v-if="isLoginTab">
        <div class="flex items-center">
          <h1 class="text-3xl font-bold mr-2">ログイン</h1>
          <a class="cursor-pointer mr-2" @click="isLoginTab = !isLoginTab">新規登録はこちら</a>
          <a class="cursor-pointer" @click="onLogin({ mode: 'google' })">Google認証</a>
        </div>

        <el-input v-model="loginVal.email" placeholder="aaa@bbcc.com" />
        <el-input
          v-model="loginVal.password"
          type="password"
          placeholder="password"
          show-password
        />
        <el-button type="primary" @click="onLogin({ mode: 'login' })">ログイン</el-button>
      </template>
      <template v-else>
        <div class="flex items-center">
          <h1 class="text-3xl font-bold mr-2">新規登録</h1>
          <a class="cursor-pointer mr-2" @click="isLoginTab = !isLoginTab">ログインはこちら</a>
          <a class="cursor-pointer" @click="onLogin({ mode: 'google' })">Google認証</a>
        </div>

        <el-input v-model="loginVal.email" placeholder="aaa@bbcc.com" />
        <el-input
          v-model="loginVal.password"
          type="password"
          placeholder="password"
          show-password
        />
        <el-button type="primary" @click="onLogin({ mode: 'register' })">登録</el-button>
      </template>
    </div>
    <div class="py-3 px-6" v-else>
      <div class="flex items-center">
        <div class="flex items-center">
          <h1 class="font-bold mr-2">ようこそ、{{ userInfo?.data.displayName }}さん</h1>
          <span class="cursor-pointer" @click="onLogout">ログアウト</span>
        </div>
      </div>
    </div>
  </div>
</template>
