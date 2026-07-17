import SavedCardsList from "../../organisms/SavedCardsList";
import "./ProfilePaymentMethods.css";

const ProfilePaymentMethods = () => (
  <section className="profile-pm">
    <h2 className="profile-pm__heading">Cardurile mele</h2>
    <SavedCardsList />
  </section>
);

export default ProfilePaymentMethods;
