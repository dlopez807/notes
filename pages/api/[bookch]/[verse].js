export default (req, res) => {
  const {
    query: { scripture },
  } = req;
  res.json({
    scripture,
  });
};
