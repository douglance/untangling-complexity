export const fetchUserData = (userId: string) => {
  // return fetch(`https://jsonplaceholder.typicode.com/users${userId}`).then(
  //   (response) => response.json()
  // );
  return Promise.reject(new Error("Request failed"));
};

export const fetchUserPosts = (userId: string) => {
  return fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  ).then((response) => response.json());
};

export const getUserData = (userId: string) => {
  return fetchUserData(userId).catch((error) => {
    throw new Error(`Failed to fetch user data:\n\n${error}`);
  });
};

export const getUserPosts = (userId: string) => {
  return fetchUserPosts(userId).catch((error) => {
    throw new Error(`Failed to fetch user posts:\n\n${error}`);
  });
};

export const getDashboardData = (userId: string) => {
  return getUserData(userId)
    .then((userData) => {
      return getUserPosts(userId).then((userPosts) => {
        return { userData, userPosts };
      });
    })
    .catch((error) => {
      throw new Error(`Failed to fetch dashboard data:\n\n${error}`);
    });
};

getDashboardData("1")
  .then((data) => console.log(data))
  .catch((error) => console.error(`Error in app:\n\n${error}`));
