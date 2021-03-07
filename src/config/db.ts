import mongoose from 'mongoose';

export default () => {
  const uri = process.env['DATABASE_URL'] || '';
  const client = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
};
