import Space from "@/app/components/Space";
import MultiFactors from "./MultiFactors/MultiFactors";
import PasswordReset from "./PasswordReset";
import SettingsCard from "./SettingsCard";

const page = async () => {
  return (
    <div>
      <SettingsCard heading="Multi Factor Authentication">
        <MultiFactors />
      </SettingsCard>

      <Space />

      <SettingsCard heading="Change Password">
        <PasswordReset />
      </SettingsCard>

      <Space />
    </div>
  );
};

export default page;
