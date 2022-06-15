import { useState } from 'react';

export default function Penyata2() {
  return (
    <>
      <div className="grid grid-rows-3 grid-flow-col gap-4 border-x-user1 text-left p-1 border-solid border-2">
        <div className="row-span-2 border-x-user1 text-left p-1 border-solid border-2">
          <div className="grid grid-rows-4">
            <div>
              <p>cabutan</p>
              <p>gigi telah dicabut</p>
              <div className="border-x-user1 text-left p-1 border-solid border-2 grid grid-cols-4">
                <div>
                  <p>decidus</p>
                </div>
                <div>
                  <input type="number" name="cabutD" id="cabutD" />
                </div>
                <div>
                  <p>kekal</p>
                </div>
                <div>
                  <input type="number" name="cabutK" id="cabutK" />
                </div>
              </div>
            </div>
            <div>
              <p>tampalan sementara</p>
              <p>jumlah tampalan sementara</p>
              <input type="number" name="tampalan" id="tampalan" />
            </div>
            <div>03</div>
            <div>04</div>
          </div>
        </div>
        <div className="row-span-2 border-x-user1 text-left p-1 border-solid border-2">
          <p>promosi</p>
          <div className="grid grid-rows-3">
            <div className="border-x-user1 text-left p-1 border-solid border-2">
              <p>menyertai</p>
            </div>
            <div>02</div>
            <div>03</div>
          </div>
        </div>
      </div>
    </>
  );
}
