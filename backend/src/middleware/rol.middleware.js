module.exports = (rolRequerido) => {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== rolRequerido) {
      return res.status(403).json({ message: 'No tienes permisos' });
    }
    next();
  };
};