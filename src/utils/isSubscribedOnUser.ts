const isSubscribedOnUser = (userId, subscriptions) => {
    const idArray = subscriptions.map((el) => el.id);
    return idArray.includes(userId);
};

export default isSubscribedOnUser;
