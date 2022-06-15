import { useState } from 'react';

export default function Kotak() {
  return (
    <>
      <div className="grid grid-rows-3 grid-flow-col gap-4">
        <div class="row-span-2 text-left p-1">
          <div className="grid grid-rows-2">
            <div className="border-x-user1 text-left p-1 border-solid border-2">
              <p>status merokok</p>
              <select name="statusM" id="statusM">
                <option value="merokok">merokok</option>
                <option value="tidak merokok">tidak merokok</option>
              </select>
            </div>
            <div className="border-x-user1 text-left p-1 border-solid border-2 mt-2">
              <p>jenis rokok</p>
              <select name="jenisR" id="jenisR">
                <option value="rokokB">rokok biasa</option>
                <option value="rokokK">rokok khusus</option>
                <option value="shisha">Shisha</option>
                <option value="lain2">Lain-lain</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row-span-2 border-solid border-2 border-x-user1 text-left p-1 mt-1 mb-1">
          <p>tarikh intervensi merokok</p>
          <br />
          <p>Sesi 1:</p>
          <input type="date" name="tarikh1" id="tarikh1" />
          <p>Sesi 2:</p>
          <input type="date" name="tarikh2" id="tarikh2" />
          <p>Sesi 3:</p>
          <input type="date" name="tarikh3" id="tarikh3" />
          <p>Sesi 4:</p>
          <input type="date" name="tarikh4" id="tarikh4" />
        </div>
        <div class="row-span-2 text-left p-1">
          <div className="grid grid-rows-3">
            <div className="border-solid border-2 border-x-user1 text-left p-1">
              <p>status selepas intervensi</p>
              <input type="checkbox" name="adaQ" id="adaQ" />
              ada quit date
              <br />
              <input type="checkbox" name="tiadaQ" id="tiadaQ" />
              tiada quit date
              <br />
              <input type="checkbox" name="rujukG" id="rujukG" />
              rujuk guru kaunseling
            </div>
            <div className="border-solid border-2 border-x-user1 text-left p-1 mt-2">
              <p>tarikh quit date</p>
              <input type="date" name="tarikhQ" id="tarikhQ" />
            </div>
            <div className="border-solid border-2 border-x-user1 text-left p-1 mt-2">
              <p>status selepas 6 bulan</p>
              <select name="statusU" id="statusU">
                <option value="berhenti">berhenti merokok</option>
                <option value="tidakberhenti">keep on smokin' bro</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
