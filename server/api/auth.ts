import { PrismaClient } from '@prisma/client';
import { sendError } from 'h3';

export default defineEventHandler(async (e) => {
  const prisma = new PrismaClient();
  const method = e.req.method;
  const APP_SECRET = 'prismaTest';
  let data = null;
  let id = '';
  let uid = '';
  let token = '';

  if (method === 'POST') {
    console.log('post');
    const body = await readBody(e);
    if (!body) {
      const detailError = createError({
        statusCode: 400,
        statusMessage: 'No item provided',
        data: {},
      });

      sendError(e, detailError);
    }

    // --------------------------------------------------
    // register
    // --------------------------------------------------
    if (body.mode === 'register') {
      console.log('register', body);
      let checkUser = await prisma.users.findUnique({
        where: { uid: body.data.uid },
      });
      if (checkUser) {
        console.log('いますね');
        data = checkUser;
      } else {
        console.log('いないので登録');
        data = await prisma.users.create({
          data: body.data,
        });
        token = body.data.token;
        uid = body.data.uid;

        // console.log('await', data);
      }
    } else if (body.mode === 'login') {
      // --------------------------------------------------
      // login
      // --------------------------------------------------
      data = await prisma.users.findUnique({
        where: { email: body.data.email },
      });

      if (!data) {
        throw new Error('そのようなユーザーは存在しません');
      } else {
        // トークンの更新
        data = await prisma.users.update({
          where: { email: body.data.email },
          data: { token: body.data.token },
          include: { mytodo_id: true },
        });
        token = body.data.token;
        uid = body.data.uid;
      }
    } else {
      // --------------------------------------------------
      // Google認証
      // --------------------------------------------------

      let checkUser = await prisma.users.findUnique({
        where: { uid: body.uid },
        include: { mytodo_id: true },
      });

      uid = body.uid;
      token = body.token;

      if (checkUser) {
        console.log('いますね');
        data = checkUser;
      } else {
        console.log('いないので登録');
        data = await prisma.users.create({
          data: body,
        });
      }
    }

    return {
      data,
      token,
      uid,
    };
  }
});
