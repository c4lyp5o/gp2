import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function PemeriksaanAwal() {
  return (
    <>
      <div className='p-2'>
        <form>
            <div className='grid grid-cols-2 '>
            <button
            className='flex bg-user3 p-2 w-full capitalize col-span-2'
            >
            <p className='ml-3 text-xl font-semibold'>Pemeriksaan Awal</p>
            </button>
            <section
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 mb-3 w-full col-span-2 '
            >
                <div className='grid gap-2'>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md '>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>Cleft Lip/Palate</h4>
                        <div className='flex flex-row items-center pl-5 pt-1'>
                            <input type="checkbox" name="ada-cleft-lip" id="ada-cleft-lip" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'/>
                            <label htmlFor="ada-cleft-lip" class="mx-2 text-sm font-m">Ada</label>
                        </div>
                        <div className='flex flex-row items-center pl-5 pt-1'>
                            <input type="checkbox" name="rujuk-cleft-lip-palate" id="rujuk-cleft-lip-palate" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="rujuk-cleft-lip-palate" class="mx-2 text-sm font-m">Rujuk</label>
                        </div>
                    </article>
                    <article className='row-span-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>Status denture</h4>
                        <div className='grid grid-rows-2 gap-2'>
                            <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                                <h4 className='font-semibold'>Sedia Ada?</h4>
                                <div className='flex items-center justify-center'>
                                    <input type="radio" name="sedia-ada-status-denture" id="ada-sedia-ada-status-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                    <label htmlFor="ada-sedia-ada-status-denture" className='m-2 text-sm font-m'>Ada</label>
                                    <input type="radio" name="sedia-ada-status-denture" id="tidak-sedia-ada-status-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                    <label htmlFor="tidak-sedia-ada-status-denture" className='m-2 text-sm font-m'>Tidak</label>
                                </div>
                                <div className='flex items-center flex-row pl-5'>
                                    <label htmlFor="atas-sedia-ada-denture" className='m-2 text-sm font-m'>Atas</label>
                                    <input type="checkbox" name="atas-sedia-ada-denture" id="atas-sedia-ada-denture" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-atas-sedia-ada-denture" id="separa-atas-sedia-ada-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="separa-atas-sedia-ada-denture" className='m-2 text-sm font-m'>Separa</label>
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-atas-sedia-ada-denture" id="penuh-atas-sedia-ada-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="penuh-atas-sedia-ada-denture" className='m-2 text-sm font-m'>Penuh</label>
                                    </div>
                                </div>
                                <div className='flex items-center flex-row pl-5'>
                                    <label htmlFor="bawah-sedia-ada-denture" className='m-2 text-sm font-m'>Bawah</label>
                                    <input type="checkbox" name="bawah-sedia-ada-denture" id="bawah-sedia-ada-denture" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-bawah-sedia-ada-denture" id="separa-bawah-sedia-ada-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="separa-bawah-sedia-ada-denture" className='m-2 text-sm font-m'>Separa</label>
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-bawah-sedia-ada-denture" id="penuh-bawah-sedia-ada-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="penuh-bawah-sedia-ada-denture" className='m-2 text-sm font-m'>Penuh</label>
                                    </div>
                                </div>
                            </article>
                            <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-semibold'>Perlu</h4>
                                <div className='flex items-center justify-center'>
                                    <input type="radio" name="perlu-status-denture" id="ada-perlu-status-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                    <label htmlFor="ada-perlu-status-denture" className='m-2 text-sm font-m'>Ada</label>
                                    <input type="radio" name="perlu-status-denture" id="tidak-perlu-status-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                    <label htmlFor="tidak-perlu-status-denture" className='m-2 text-sm font-m'>Tidak</label>
                                </div>
                                <div className='flex items-center flex-row pl-5'>
                                    <label htmlFor="atas-perlu-denture" className='m-2 text-sm font-m'>Atas</label>
                                    <input type="checkbox" name="atas-perlu-denture" id="atas-perlu-denture" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-atas-perlu-denture" id="separa-atas-perlu-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="separa-atas-perlu-denture" className='m-2 text-sm font-m'>Separa</label>
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-atas-perlu-denture" id="penuh-atas-perlu-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="penuh-atas-perlu-denture" className='m-2 text-sm font-m'>Penuh</label>
                                    </div>
                                </div>
                                <div className='flex items-center flex-row pl-5'>
                                    <label htmlFor="bawah-perlu-denture" className='m-2 text-sm font-m'>Bawah</label>
                                    <input type="checkbox" name="bawah-perlu-denture" id="bawah-perlu-denture" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-bawah-perlu-denture" id="separa-bawah-perlu-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="separa-bawah-perlu-denture" className='m-2 text-sm font-m'>Separa</label>
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <input type="radio" name="separa-penuh-bawah-perlu-denture" id="penuh-bawah-perlu-denture" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                        <label htmlFor="penuh-bawah-perlu-denture" className='m-2 text-sm font-m'>Penuh</label>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </article>
                    <article className='grid grid-cols-1 xl:grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-1 xl:col-span-2'>Trauma</h4>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="tooth-surface-loss" id="tooth-surface-loss" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="tooth-surface-loss" className='m-2 text-sm font-m'>Tooth Surface Loss</label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="kecederaan-gigi-anterior" id="kecederaan-gigi-anterior" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="kecederaan-gigi-anterior" className='m-1 text-sm font-m'>Kecederaan Gigi Anterior</label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="tisu-lembut" id="tisu-lembut" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="tisu-lembut" className='m-2 text-sm font-m'>Tisu Lembut</label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <input type="checkbox" name="tisu-keras" id="tisu-keras" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '/>
                            <label htmlFor="tisu-keras" className='m-2 text-sm font-m'>Tisu Keras</label>
                        </div>
                    </article>
                </div>
                <div className='grid grid-rows-4 gap-2'>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>Oral Hygiene</h4>
                        <div className='flex items-center '>
                            <p className='flex flex-row pl-5 text-sm font-m col-span-2 md:col'>Kebersihan Mulut</p>
                            <select name="kebersihan-mulut" id="kebersihan-mulut" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'>
                                <option value=""></option>
                                <option value="A">A</option>
                                <option value="C">C</option>
                                <option value="E">E</option>
                            </select>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <select name="skor-bpe" id="skor-bpe" className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'>
                                <option value="">Skor BPE</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <label htmlFor="saringan-kanser-mulut" className='text-sm font-m'>Saringan Kanser Mulut</label>
                            <input type="checkbox" name="saringan-kanser-mulut" id="saringan-kanser-mulut" className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'/>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                            <select name="skor-gis" id="skor-gis" className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'>
                                <option value="">Skor GIS</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </article>
                    <article className=' border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>Status Gigi Desidus</h4>
                        <div className='flex flex-row pl-5 '>
                        <div className='grid grid-cols-1'>
                            <button className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'>Tiada</button>
                            <p>Klik butang di atas jika ada gigi desidus</p>
                        </div>
                        </div>
                    </article>
                    <article className='border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>Status Gigi Kekal</h4>
                        <div className='flex flex-row pl-5 '>
                        <div className='grid grid-cols-1'>
                            <button className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'>Tiada</button>
                            <p>Klik butang di atas jika ada gigi kekal</p>
                        </div>
                        </div>
                    </article>
                    <article className='border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='grid grid-cols-1'>
                            <h4 className='font-bold flex flex-row pl-5'>Risiko Karies</h4>
                            <div className='flex flex-row'>
                                <p className='flex items-center flex-row pl-5'>Jumlah Faktor Risiko:</p>
                                <input type="text" name="jumlah-faktor-risiko" id="jumlah-faktor-risiko" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                            </div>
                            <div className='grid grid-cols-3 gap-1'>
                                <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m '>Rendah</p>
                                <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m'>Sederhana</p>
                                <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m'>Tinggi</p>
                            </div>
                        </div>
                    </article>
                </div>
                <div className='grid gap-2'>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>Bilangan FS Dibuat 3 Tahun Lepas</h4>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>GIC: </p>
                            <input type="text" name="gic-bilangan-fs-dibuat-3-tahun-lepas" id="gic-bilangan-fs-dibuat-3-tahun-lepas" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>Resin: </p>
                            <input type="text" name="resin-bilangan-fs-dibuat-3-tahun-lepas" id="resin-bilangan-fs-dibuat-3-tahun-lepas" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center col-span-2 md:col-span-1'>
                            <p className='text-sm font-m '>Lain-lain: </p>
                            <input type="text" name="lain-lain-bilangan-fs-dibuat-3-tahun-lepas" id="lain-lain-bilangan-fs-dibuat-3-tahun-lepas" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                    </article>
                    <article className='grid grid-cols-2 md:grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2 md:col-span-3'>Bilangan FS Dibuat 3 Tahun Lepas Terjadi</h4>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>D: </p>
                            <input type="text" name="d-bilangan-fs-dibuat-3-tahun-lepas-terjadi" id="d-bilangan-fs-dibuat-3-tahun-lepas-terjadi" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>M: </p>
                            <input type="text" name="m-bilangan-fs-dibuat-3-tahun-lepas-terjadi" id="m-bilangan-fs-dibuat-3-tahun-lepas-terjadi" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>F: </p>
                            <input type="text" name="f-bilangan-fs-dibuat-3-tahun-lepas-terjadi" id="f-bilangan-fs-dibuat-3-tahun-lepas-terjadi" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>E: </p>
                            <input type="text" name="e-bilangan-fs-dibuat-3-tahun-lepas-terjadi" id="e-bilangan-fs-dibuat-3-tahun-lepas-terjadi" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>X: </p>
                            <input type="text" name="x-bilangan-fs-dibuat-3-tahun-lepas-terjadi" id="x-bilangan-fs-dibuat-3-tahun-lepas-terjadi" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                    </article>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>D</h4>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>Class I: </p>
                            <input type="text" name="class-1-d" id="class-1-d" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>Class II: </p>
                            <input type="text" name="class-2-d" id="class-2-d" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                    </article>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>F</h4>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>Class I: </p>
                            <input type="text" name="class-1-f" id="class-1-f" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                        <div className='flex flex-row pl-5 items-center'>
                            <p className='text-sm font-m '>Class II: </p>
                            <input type="text" name="class-2-f" id="class-2-f" className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'/>
                        </div>
                    </article>
                </div>
            </section>
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
