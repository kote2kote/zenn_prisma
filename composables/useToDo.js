import { v4 as uuid } from 'uuid';
const useToDo = () => {
  // -- 新規ToDo用 -------------- //
  let tempToDoData = {
    title: '',
    description: '',
    uid: uuid(),
    orner_id: '',
    favorited: [],
  };

  // -- 新規SubToDo用 -------------- //
  let tempSubToDoData = {
    todo_id: '',
    uid: uuid(),
    orner_id: '',
    title: '',
    description: '',
  };

  // --------------------------------------------------
  // read ToDo
  // --------------------------------------------------
  const { data: dataToDo } = useFetch('/api/todo');

  // --------------------------------------------------
  // createToDo
  // --------------------------------------------------
  const createToDo = async (values) => {
    console.log(values, 'create');
    let tempData = {};
    if (values.mode === 'create') {
      tempData = { ...tempToDoData };
      tempData.title = values.data.title;
      tempData.description = values.data.description;
      tempData.orner_id = values.data.orner_id;
    } else if (values.mode === 'createSub') {
      tempData = { ...tempSubToDoData };
      tempData.url = values.data.url;
      tempData.title = values.data.title;
      tempData.description = values.data.description;
      tempData.orner_id = values.data.orner_id;
      tempData.todo_id = values.data.todo_id;
    }

    // console.log('mode:', values.mode, 'data:', values.data);
    const data = await $fetch('/api/todo', {
      method: 'post',
      body: { mode: values.mode, data: tempData },
    });
    await refreshNuxtData();
    console.log(data);
    return data;
  };

  // --------------------------------------------------
  // updateToDo
  // --------------------------------------------------
  const updateToDo = async (values) => {
    console.log(values, 'update');
    const data = await $fetch('/api/todo', {
      method: 'put',
      body: { mode: values.mode, data: values.data, targetId: values.targetId },
    });
    console.log(data);
    // ↓2回実行されてしまうのでボツ
    // const data = await useFetch('/api', { method: 'post', body: values, server: false });
    await refreshNuxtData();
    return data;
  };
  // --------------------------------------------------
  // fav,save
  // --------------------------------------------------
  const changeStatus = async (values) => {
    console.log('changeStatus', values);
    let temp = {};
    if (values.mode === 'deleteFav') {
      // -- todo.favoritedからuserIdを削除 -------------- //
      let tempFavorited = values.todoData.data.favorited;
      let resultFavorited = tempFavorited.filter((v) => {
        return v !== values.userData.id;
      });

      // -- users.favoritからtodoIdを削除 -------------- //
      let tempFavorite = values.userData.data.favorite;
      let resultFavorite = tempFavorite.filter((v) => {
        return v !== values.todoData.id;
      });

      temp = {
        mode: values.mode,
        data: {
          targetId: values.todoData.id, // いいねしたToDoId
          ornerId: values.userData.id, // いいねしたUserId
          favorited: resultFavorited, // いいねした人jsonリスト
          favorite: resultFavorite, // 自分がいいねしたjsonリスト
        },
      };
      // console.log(resultFav);
    } else if (values.mode === 'addFav') {
      // -- todo.favoritedからuserIdを削除 -------------- //
      let tempFavorited = values.todoData.data.favorited;
      tempFavorited.push(values.userData.id);

      // -- users.favoritからtodoIdを削除 -------------- //
      let tempFavorite = values.userData.data.favorite;
      tempFavorite.push(values.todoData.id);

      temp = {
        mode: values.mode,
        data: {
          targetId: values.todoData.id, // いいねしたToDoId
          ornerId: values.userData.id, // いいねしたUserId
          favorited: tempFavorited, // いいねした人jsonリスト
          favorite: tempFavorite, // 自分がいいねしたjsonリスト
        },
      };
    }
    console.log(temp);

    const data = await $fetch('/api/todo', {
      method: 'put',
      body: temp,
    });
    await refreshNuxtData();
    return data;
  };

  // --------------------------------------------------
  // deleteToDo
  // --------------------------------------------------
  const deleteToDo = async (values) => {
    console.log(values, 'delete');
    const data = await $fetch('/api/todo', {
      method: 'delete',
      body: { mode: values.mode, id: values.id },
    });

    await refreshNuxtData();
    return data;
  };
  return {
    dataToDo,
    createToDo,
    updateToDo,
    deleteToDo,
    changeStatus,
  };
};
export default useToDo;
