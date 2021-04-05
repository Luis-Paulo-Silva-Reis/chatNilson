import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string().min(2).required(),
  cidade: Yup.string().min(2).required(),
  date: Yup.date().default( () => new Date()),
  email: Yup.string().email().required(),
  rating: Yup.number().required(),

});
