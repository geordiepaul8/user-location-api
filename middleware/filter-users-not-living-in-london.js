/**
 * Filter the users that do jnot Live in London by extracting those that have the city
 * 'London' attched to their profile.
 *
 * @throws {TypeError} When the req.data items are not present.
 * @returns {object} Middleware chain.
 */
const filterUsersNotLivingInlondon = () => (req, res, next) => {
  try {
    if (!(req?.data?.londonUsersList && req?.data?.allUsersList)) {
      throw new TypeError('No valid data is found within the req.data object');
    }

    /*
     * Extract the id's from the London users. This will be used to filter
     * these people out of the full list.
     */
    const londonUsersIdList = req.data.londonUsersList.map((a) => a.id);

    req.data = Object.assign(req.data, {
      outsideLondonUsersList: req.data.allUsersList.filter(
        (r) => !londonUsersIdList.includes(r.id),
      ),
    });

    next();
  } catch (error) {
    req.log.error(`Error found in filterUsersNotLivingInlondon: ${error.message}`);
    next(error);
  }
};

module.exports = filterUsersNotLivingInlondon;
