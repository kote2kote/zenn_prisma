<script setup>
import { TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { ElMessageBox } from 'element-plus';
const pageTitle = ref('');
// --------------------------------------------------
// composables
// --------------------------------------------------
const { userInfo } = useAuth();
const { dataToDo, createToDo, updateToDo, deleteToDo, changeStatus } = useToDo();

// --------------------------------------------------
// Dialog
// --------------------------------------------------
const dialogVisible = ref(false);

// --------------------------------------------------
// Form
// --------------------------------------------------
const val = reactive({
  id: null,
  todo_id: '',
  title: '',
  description: '',
  mode: 'create',
});

// -- update/delete用に元データをセット -------------- //
const setVal = (props) => {
  console.log('props: ', props);
  resetForm();

  val.mode = props.mode;

  if (val.mode === 'create') {
    resetForm();
  } else if (val.mode === 'createSub') {
    val.title = '';
    val.description = '';
    val.todo_id = props.data.id;
  } else if (val.mode === 'update') {
    val.id = props.data.id;
    val.title = props.data.title;
    val.description = props.data.description;
  } else if (val.mode === 'updateSub') {
    val.id = props.data.id;
    val.title = props.data.title;
    val.description = props.data.description;
  } else {
    // delete
    val.id = props.data.id;
  }

  console.log('setVal', val);
};
const onSubmit = async () => {
  console.log(userInfo.value);
  let temp = {};
  if (val.mode === 'create' || val.mode === 'createSub') {
    console.log('create or createSub', val);
    if (val.mode === 'create') {
      temp = {
        mode: val.mode,
        data: {
          title: val.title,
          description: val.description,
          orner_id: userInfo.value.data.id,
        },
      };
    } else {
      temp = {
        mode: val.mode,
        data: {
          title: val.title,

          description: val.description,
          todo_id: val.todo_id,
          orner_id: userInfo.value.data.id,
        },
      };
    }
    console.log('data:', temp);
    await createToDo(temp);
    resetForm();
  } else if (val.mode === 'update' || val.mode === 'updateSub') {
    console.log('update or updateSub', val);
    if (val.mode === 'update') {
      temp = {
        mode: val.mode,
        targetId: val.id,
        data: {
          title: val.title,
          description: val.description,
        },
      };
    } else {
      temp = {
        mode: val.mode,
        targetId: val.id,
        data: {
          title: val.title,
          description: val.description,
        },
      };
    }
    await updateToDo(temp);
    resetForm();
  } else {
    // delete or addSubToDo
    console.log('delete or addSubToDo', val);
    await deleteToDo({ mode: val.mode, id: val.id });
    resetForm();
  }
};
const onChangeStatus = async (values) => {
  console.log(values);
  if (values.mode === 'addFav' || values.mode === 'deleteFav') {
    await changeStatus({ mode: values.mode, todoData: values, userData: userInfo.value });
  }
};
const resetForm = () => {
  val.id = null;
  val.todo_id = '';
  val.title = '';
  val.description = '';
  val.mode = 'create';
};

// --------------------------------------------------
// util
// --------------------------------------------------
const isTrue = (values) => {
  // console.log('isTrue', values);
  let count = 0;
  for (const n of values.data) {
    if (values.targetId === n) {
      count++;
    }
  }
  let test = count > 0 ? true : false;
  // console.log(test);
  return test;
};
</script>

<template>
  <div class="">
    <Html>
      <Head>
        <Title>{{ pageTitle }}</Title>
      </Head>
    </Html>
    <div class="py-3 px-6" v-if="userInfo">
      <div class="inner flex gap-12">
        <section class="w-1/3">
          <h3 class="text-2xl font-bold mb-2">
            <span v-if="val.mode === 'create'">新規ToDo</span>
            <span v-if="val.mode === 'createSub'">新規サブToDo</span>
            <span v-if="val.mode === 'update'">編集ToDo</span>
            <span v-if="val.mode === 'updateSub'">編集サブToDo</span>
            フォーム
          </h3>
          <form action="">
            <el-input v-model="val.title" placeholder="title" />
            <el-input v-model="val.description" placeholder="desctiptions" />
            <el-button type="primary" @click="onSubmit()">送信</el-button>
          </form>
          <span v-if="val.mode !== 'create'" class="cursor-pointer" @click="val.mode = 'create'"
            >新規ToDo</span
          >
        </section>

        <section class="w-1/3">
          <h3 class="text-2xl font-bold mb-2">私のToDo</h3>
          <ul class="list-demical">
            <li v-for="n in dataToDo" :key="n.id">
              <template v-if="n.orner_id === userInfo.data.id">
                <div class="flex justify-between">
                  <div class="">{{ n.title }} (by {{ n.orner_id_more.id }})</div>
                  <div class="flex">
                    <span
                      class="cursor-pointer mr-4 w-4 h-4"
                      @click="setVal({ mode: 'createSub', data: n })"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                        />
                      </svg>
                    </span>
                    <span
                      class="cursor-pointer mr-4 w-4 h-4"
                      @click="setVal({ mode: 'update', data: n })"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                          d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                        />
                      </svg>
                    </span>
                    <span
                      class="cursor-pointer w-4 h-4"
                      @click="(dialogVisible = true), setVal({ mode: 'delete', data: n })"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <template v-if="n.subtodo_id.length !== 0">
                  <ul class="pl-4 list-disc">
                    <li v-for="nn in n.subtodo_id" :key="nn.id">
                      <div class="flex justify-between">
                        <div class="">{{ nn.title }}</div>
                        <div class="flex">
                          <span
                            class="cursor-pointer mr-4 w-3 h-3"
                            @click="setVal({ mode: 'updateSub', data: nn })"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path
                                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                              />
                            </svg>
                          </span>
                          <span
                            class="cursor-pointer w-3 h-3"
                            @click="
                              (dialogVisible = true), setVal({ mode: 'addSubToDo', data: nn })
                            "
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                              <path
                                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </template>
              </template>
            </li>
          </ul>
        </section>

        <section class="w-1/3">
          <h3 class="text-2xl font-bold mb-2">みんなのToDo</h3>
          <ul>
            <li v-for="n in dataToDo" :key="n.id" class="flex justify-between">
              <div class="">{{ n.title }} (by {{ n.orner_id_more.id }})</div>
              <div class="">
                <!-- いいねしている -->
                <span
                  v-if="isTrue({ targetId: userInfo.data.id, data: n.favorited })"
                  class="text-xs cursor-pointer"
                  @click="onChangeStatus({ mode: 'deleteFav', id: n.id, data: n })"
                  >いいね取り消し</span
                >
                <!-- いいねしてない -->
                <span
                  v-else
                  class="text-xs cursor-pointer"
                  @click="onChangeStatus({ mode: 'addFav', id: n.id, data: n })"
                  >いいね</span
                >
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <client-only>
      <el-dialog v-model="dialogVisible" title="ToDoを消します" width="30%">
        <span>この操作は取り消せません</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="(dialogVisible = false), onSubmit({ mode: 'delete' })"
            >
              削除する
            </el-button>
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<style lang="scss">
//
</style>
