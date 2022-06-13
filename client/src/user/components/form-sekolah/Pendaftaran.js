import { useState } from 'react';

export default function Pendaftaran() {
  return (
    <>
      <div className=" grid grid-cols-2 border-b-adminBlack">
        <div className="border-solid border-2 border-x-user6">
          <p>penyampaian perkhidmatan</p>
          <div className="grid grid-cols-2">
            <div>
              <input type="checkbox" />
              KP Bergerak
            </div>
            <div>
              <input type="checkbox" />
              KP Tidak Bergerak
            </div>
            <select id="plate">
              <option value="">Number Plate</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <br />
          </div>
        </div>
        <div className="border-x-user6">sup</div>
      </div>
    </>
  );
}
