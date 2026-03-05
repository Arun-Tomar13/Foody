import { FormProvider as Form } from "react-hook-form";

const FormProvider = ({children,onSubmit}) => {
  return (
    <Form >
        <form onSubmit={onSubmit}>
            {children}
        </form>
    </Form>
  )
}

export default FormProvider