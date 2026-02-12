import clientPromise from "@/lib/mongodb";

export async function getOverviewData() {
  const client = await clientPromise;
  const db = client.db("Devwings");

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const contactsCount = await db
    .collection("contacts")
    .countDocuments();

  const estimatesCount = await db
    .collection("estimateSubmissions")
    .countDocuments();

  const careersCount = await db
    .collection("careerApplications")
    .countDocuments();

  const contactsThisMonth = await db
    .collection("contacts")
    .countDocuments({ createdAt: { $gte: startOfMonth } });

  const estimatesThisMonth = await db
    .collection("estimateSubmissions")
    .countDocuments({ createdAt: { $gte: startOfMonth } });

  const careersThisMonth = await db
    .collection("careerApplications")
    .countDocuments({ createdAt: { $gte: startOfMonth } });

  const thisMonthCount =
    contactsThisMonth + estimatesThisMonth + careersThisMonth;

  return {
    views: {
      value: contactsCount,
      growth: 0,
    },
    profit: {
      value: estimatesCount,
      growth: 0,
    },
    products: {
      value: careersCount,
      growth: 0,
    },
    users: {
      value: thisMonthCount,
      growth: 0,
    },
  };
}



export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}