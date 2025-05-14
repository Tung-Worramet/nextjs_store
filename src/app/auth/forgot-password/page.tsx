import AuthHeader from "@/features/auths/components/auth-header";
import ForgotPasswordForm from "@/features/auths/components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <AuthHeader type="forgot-password">
      <ForgotPasswordForm />
    </AuthHeader>
  );
};
export default ForgotPasswordPage;
