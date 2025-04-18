/**
 * Wrapper function to catch async errors
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Middleware function with error handling
 */
module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };