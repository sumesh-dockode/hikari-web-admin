import { metaObject } from '@/config/site.config';
import PasswordSettingsView from '@/app/shared/account-settings/password-settings';

export const metadata = {
  ...metaObject('Profile Settings'),
};

export default function ProfileSettingsFormPage() {
  //  return <PersonalInfoView />;
   return<PasswordSettingsView/>

}
