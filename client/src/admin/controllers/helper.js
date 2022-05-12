import { useState } from "react";
import { getTokenized } from "../../useToken";
import axios from "axios";

export async function getKP() {
  let response = await axios.post(
    `http://localhost:5000/api/v1/superadmin/kp`,
    {
      token: getTokenized(),
    }
  );
  console.log(response);
  return response.data;
}
