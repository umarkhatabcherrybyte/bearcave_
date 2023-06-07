import React from "react";

function RewardInformationInstance(props) {
  const cardText = {
    fontFamily: "Rubik",
    fontSize: 10,
  };

  let title = props.title;
  let value = props.value;
  return (
    <tr>
      <td width={"40vw"} style={cardText}>
        {title}
      </td>
      <td width={"30vw"} style={cardText}>
        :
      </td>
      <td width={"30vw"} style={cardText}>
        {value}
      </td>
    </tr>
  );
}

export default RewardInformationInstance;
