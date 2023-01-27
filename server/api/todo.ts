import { PrismaClient, Prisma } from '@prisma/client';
import { sendError } from 'h3';

export default defineEventHandler(async (e) => {
  const prisma = new PrismaClient();
  const method = e.req.method;

  if (method === 'GET') {
    // console.log(method);
    const todo = await prisma.todo.findMany({
      include: { orner_id_more: true, subtodo_id: true }, // Usersもsubtodoもゲットしてくる
      orderBy: { created_at: 'desc' },
    });

    return todo;
  }

  if (method === 'POST') {
    const body = await readBody(e);
    console.log('post', body);
    if (!body) {
      const detailError = createError({
        statusCode: 400,
        statusMessage: 'No item provided',
        data: {},
      });
      sendError(e, detailError);
    }

    let temp = {};
    try {
      if (body.mode === 'create') {
        temp = await prisma.todo.create({
          data: body.data,
        });
      }
      if (body.mode === 'createSub') {
        temp = await prisma.subtodo.create({
          data: body.data,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return temp;
  }

  if (method === 'PUT') {
    console.log('update');
    const body = await readBody(e);
    if (!body) {
      const detailError = createError({
        statusCode: 400,
        statusMessage: 'No item provided',
        data: {},
      });

      sendError(e, detailError);
    }

    let temp = {};
    if (body.mode === 'update') {
      temp = await prisma.todo.update({
        where: { id: body.targetId },
        data: body.data,
      });
    }
    if (body.mode === 'updateSub') {
      temp = await prisma.subtodo.update({
        where: { id: body.targetId },
        data: body.data,
      });
    }
    if (body.mode === 'deleteFav') {
      console.log('deleteFav', body);
      const a = prisma.todo.update({
        where: { id: body.data.targetId },
        data: { favorited: body.data.favorited },
      });
      const b = prisma.users.update({
        where: { id: body.data.ornerId },
        data: { favorite: body.data.favorite },
      });
      // -- トランザクション -------------- //
      const [resA, resB] = await prisma.$transaction([a, b]);
      console.log('transaction.', resA, resB);
    }
    if (body.mode === 'addFav') {
      console.log('addFav', body);

      const a = prisma.todo.update({
        where: { id: body.data.targetId },
        data: { favorited: body.data.favorited },
      });
      const b = prisma.users.update({
        where: { id: body.data.ornerId },
        data: { favorite: body.data.favorite },
      });
      // -- トランザクション -------------- //
      const [resA, resB] = await prisma.$transaction([a, b]);
      console.log('transaction.', resA, resB);
    }

    return temp;
  }

  if (method === 'DELETE') {
    console.log('delete');
    const body = await readBody(e);
    if (!body) {
      const detailError = createError({
        statusCode: 400,
        statusMessage: 'No item provided',
        data: {},
      });

      sendError(e, detailError);
    }
    let temp = {};
    if (body.mode === 'delete') {
      temp = await prisma.todo.delete({
        where: { id: body.id },
      });
    }
    if (body.mode === 'deleteLinks') {
      temp = await prisma.subtodo.delete({
        where: { id: body.id },
      });
    }

    return temp;
  }
});
