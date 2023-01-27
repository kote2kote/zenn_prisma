// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
// const userData = [
//   {
//     uid: 'uid',
//     email: 'alemail@email.com',
//     username:'username',
//     displayName:'displayName',
//     description:'description',
//     thumb_url:'',
//     bgthumb_name:'',
//   bgthumb_url:'',
//   thumb_name:'',
//   theme_color:'',
//   token :'',
//   role :'user',
//   favorite: [],
//     save: [],
//     follow: [],
//     follower: [],
//     follower_notifications: [],
//     status: 'active',
//     mylinksh_id: {
//       create: [
//         {
//           id:'uid',
//           title: 'Join the Prisma Slack',
//           url: 'https://slack.prisma.io',
//         }

//   ],
//     },
//     pin_linksh: '', // 追加
//     notifications: [],
//     twitter: '',
//     facebook: '',
//     instagram: '',
//     other: '',
//     memo: '',

//   }
// ]
// const userData = [
//   {
//     name: 'Alice',
//     email: 'alice@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Join the Prisma Slack',
//           content: 'https://slack.prisma.io',
//           published: true,
//         },
//       ],
//     },
//   },
//   {
//     name: 'Nilu',
//     email: 'nilu@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Follow Prisma on Twitter',
//           content: 'https://www.twitter.com/prisma',
//           published: true,
//           viewCount: 42,
//         },
//       ],
//     },
//   },
//   {
//     name: 'Mahmoud',
//     email: 'mahmoud@prisma.io',
//     posts: {
//       create: [
//         {
//           title: 'Ask a question about Prisma on GitHub',
//           content: 'https://www.github.com/prisma/prisma/discussions',
//           published: true,
//           viewCount: 128,
//         },
//         {
//           title: 'Prisma on YouTube',
//           content: 'https://pris.ly/youtube',
//         },
//       ],
//     },
//   },
// ]

// async function main() {
//   console.log(`Start seeding ...`)
//   for (const u of userData) {
//     const user = await prisma.user.create({
//       data: u,
//     })
//     console.log(`Created user with id: ${user.id}`)
//   }
//   console.log(`Seeding finished.`)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
