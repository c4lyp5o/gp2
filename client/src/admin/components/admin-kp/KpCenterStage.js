export default function KpCenterStage(props) {
  return (
    <div>
      <h1>
        Selamat datang, {props.loginInfo.username} dari {props.loginInfo.kp}
      </h1>
    </div>
  );
}
