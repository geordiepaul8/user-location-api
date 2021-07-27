/**
 * Remove duplicate object items from array.
 *
 * @param {Array} list Array list of users.
 * @returns {Array} Filtered list with duplicates returned.
 * @throws {ReferenceError} When the list parameter is not a valid Array.
 */
const removeDuplicates = (list) => {
  if (!Array.isArray(list)) {
    throw new ReferenceError('The list parameter is not a valid Array');
  }

  /*
   * Set will only allow unique values in it, so by passing the unique id's of
   * each object, if a duplicate id tries to be added, it will be ignored.
   */
  return Array.from(new Set(list.map((a) => a.id)))
    .map((id) => list.find((a) => a.id === id));
};

module.exports = removeDuplicates;
