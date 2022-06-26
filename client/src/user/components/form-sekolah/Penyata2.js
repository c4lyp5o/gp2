import { useState } from 'react';

export default function Penyata2() {
  return (
    <>
      <div className="grid grid-rows-2 grid-flow-col">
        <div className="text-left p-1">
          <div className="grid grid-rows-1">
            <div className="border-solid border-2 border-x-user1 mt-1">
              <p>cabutan</p>
              <p>gigi telah dicabut</p>
              <div className="text-left p-1 grid grid-cols-2">
                <div>
                  <p>decidus</p>
                  <input type="number" name="cabutD" id="cabutD" />
                </div>
                <div>
                  <p>kekal</p>
                  <input type="number" name="cabutK" id="cabutK" />
                </div>
              </div>
            </div>
            <div className="border-solid border-2 border-x-user1 mt-1">
              <p>tampalan sementara</p>
              <label htmlFor="">jumlah tampalan sementara</label>
              <input type="number" name="" id="" />
            </div>
            <div className="border-solid border-2 border-x-user1 mt-1">
              <strong>rawatan lain yang telah dilakukan</strong>
              <div className=" text-left p-1 grid grid-cols-4">
                <div>
                  <p>pulpotomi</p>
                  <input type="number" name="" id="" />
                </div>
                <div>
                  <p>endodontik</p>
                  <input type="number" name="" id="" />
                </div>
                <div>
                  <p>abses</p>
                  <input type="number" name="" id="" />
                </div>
                <div>
                  <p>penskaleran</p>
                  <input type="checkbox" name="" id="" />
                </div>
              </div>
            </div>
            <div className="border-solid border-2 border-x-user1 mt-1">
              <strong>status rawatan</strong>
              <div className=" text-left p-1">
                <input type="checkbox" name="" id="kselesai" />
                <label htmlFor="kselesai">kes selesai</label>
                <br />
                <input type="checkbox" name="" id="kselesai" />
                <label htmlFor="kselesai">kes selesai ICDAS</label>
                <br />
                <input type="checkbox" name="" id="kselesai" />
                <label htmlFor="kselesai">rujuk</label>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-2 text-left p-1 border-x-user1 border-solid border-2">
          <p>promosi</p>
          <div className="grid grid-rows-3">
            <div className="border-x-user1 text-left p-1 border-solid border-2 mt-5">
              <p>menyertai</p>
              <div className="grid grid-cols-2">
                <div>
                  <select name="" id="">
                    <option value="ceramah">ceramah</option>
                  </select>
                </div>
                <select name="" id="">
                  <option value="promosi">promosi</option>
                </select>
              </div>
            </div>
            <div className="border-x-user1 text-left p-1 border-solid border-2 mt-1">
              <strong>melaksanakan aktiviti begin</strong>
              <div className="grid grid-cols-2">
                <div>
                  <input type="checkbox" name="" id="aktivitiBegin" />
                  ya
                </div>
                <div>
                  <input type="checkbox" name="" id="" />
                  tidak
                </div>
              </div>
            </div>
            <div className="border-x-user1 text-left p-1 border-solid border-2 mt-1">
              <strong>nasihat pergigian individu</strong>
              <div className="grid grid-cols-2">
                <div>
                  <input type="checkbox" name="" id="nasihatPergigian" />
                  plak gigi
                  <br />
                  <input type="checkbox" name="" id="nasihatPergigian" />
                  penjagaan kesihatan mulut
                </div>
                <div>
                  <input type="checkbox" name="" id="nasihatPergigian" />
                  diet pemakanan
                  <br />
                  <input type="checkbox" name="" id="nasihatPergigian" />
                  kanser mulut
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
