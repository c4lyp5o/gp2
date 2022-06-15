import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function Pendaftaran() {
  return (
    <>
      <div className='p-2'>
        <form>
            <div className='grid grid-cols-2'>
            <button
            className='flex bg-user3 p-2 w-full capitalize col-span-2'
            >
            <p className='ml-3 text-xl font-semibold'>Pendaftaran</p>
            </button>
            <section
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 mb-3 w-full col-span-2'
            >
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>Penyampaian Perkhidmatan</h4>
                    <div className='flex flex-row items-center pl-5'>
                        <input type="checkbox" name="kp-bergerak" id="kp-bergerak" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'/>
                        <label htmlFor="kp-bergerak" class="ml-2 text-sm font-m">KP Bergerak</label>
                    </div>
                    <div className='flex flex-row items-center pl-5 col-span-1 md:col-span-2'>
                        <input type="checkbox" name="pasukan-pergigian-bergerak" id="pasukan-pergigian-bergerak" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                        <label htmlFor="pasukan-pergigian-bergerak" class="ml-2 text-sm font-m">Pasukan Pergigian Bergerak</label></div>
                    <div className='flex flex-row items-center pl-5'>
                        <select name="plate-no" id="plate-no" className='outline outline-1 outline-userBlack w-auto text-sm font-m'>
                            <option value="">Plate No</option>
                            <option value="1">1</option>
                        </select>
                    </div>
                </article>
                <article className='grid grid-cols-2 lg:grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='flex flex-row items-center pl-5 font-bold col-span-2 lg:col-span-3'>Kedatangan</h4>
                    <div className='grid grid-rows-2'>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="radio" name="kedatangan" id="baru-kedatangan-pendaftaran" class="w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                            <label htmlFor="baru-kedatangan-pendaftaran" className='m-2 text-sm font-m'>Baru</label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="radio" name="kedatangan" id="ulangan-kedatangan-pendaftaran" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                            <label htmlFor="ulangan-kedatangan-pendaftaran" className='m-2 text-sm font-m'>Ulangan</label>
                        </div>
                    </div>
                    <div className='grid grid-rows-2'>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="enggan-kedatangan" id="enggan-kedatangan" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="enggan-kedatangan" class="ml-2 text-sm font-m">Enggan</label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="tidak-hadir-kedatangan" id="tidak-hadir-kedatangan" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="tidak-hadir-kedatangan" class="ml-2 text-sm font-m">Tidak Hadir</label>
                        </div>
                    </div>
                    <div className='outline outline-1 outline-userBlack grid grid-rows-3 col-start-2 lg:col-start-3'>
                        <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>Pemeriksaan</h4>
                        <div className='flex items-center flex-row px-2'>
                        <input type="radio" name="pemeriksaan" id="ada-pemeriksaan" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                        <label htmlFor="ada-pemeriksaan" className='m-2 text-sm font-m'>Ada</label>
                        </div>
                        <div className='flex items-center flex-row px-2'>
                        <input type="radio" name="pemeriksaan" id="tiada-pemeriksaan" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                        <label htmlFor="tiada-pemeriksaan" className='m-2 text-sm font-m'>Tiada</label>
                        </div>
                    </div>
                </article>
                <article className='grid grid-cols-2 border border-userBlack pl-5 rounded-md'>
                    <h4 className='font-bold flex flex-row items-center pl-5 col-span-2'>Risiko Sekolah (PERSiS)</h4>
                      <div className='flex items-center flex-row pl-5'>
                        <input type="radio" name="risiko-sekolah" id="tinggi-risiko-sekolah" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                        <label htmlFor="tinggi-risiko-sekolah" className='m-2 text-sm font-m'>Tinggi</label>
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input type="radio" name="risiko-sekolah" id="rendah-risiko-sekolah" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                        <label htmlFor="rendah-risiko-sekolah" className='m-2 text-sm font-m'>Rendah</label>
                      </div>
                </article>
            </section>
            <div></div>
            <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
                <div className='grid grid-cols-2 gap-3 lg:col-start-2'>
                    <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>clear</button>
                    <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>next</button>
                </div>
            </div>
            </div>
        </form>
      </div>
    </>
  );
}
