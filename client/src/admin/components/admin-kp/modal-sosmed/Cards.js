const Section = ({ nama, logo, questionState, setQuestionState }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionState({ ...questionState, [name]: value });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto overflow-x-hidden'>
      {nama !== 'Twitter' && nama !== 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 shadow-md overflow-hidden m-2 rounded-lg'>
          <div className='bg-admin3 flex justify-center items-center text-sm text-adminWhite mb-2 py-2'>
            <span className='text-2xl mr-2'>{logo}</span>
            <span className='text-adminWhite font-semibold px-1.5 py-0.5 whitespace-nowrap'>
              GO LIVE!
            </span>
          </div>
          <div className='grid grid-cols-[3fr_1fr] text-xs'>
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share kurang 10
            </p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilAktivitiShareKurang10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilAktivitiShareKurang10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share lebih 10
            </p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilAktivitiShareLebih10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilAktivitiShareLebih10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Penonton</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilPenonton`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Reach</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilReach`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Share</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilShare`]}
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilShare',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      ) : null}
      {nama === 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 shadow-md overflow-hidden m-2 rounded-lg'>
          <div className='bg-admin3 flex justify-center items-center text-sm text-adminWhite mb-2 py-2'>
            <span className='text-2xl mr-2'>{logo}</span>
            <span className='text-adminWhite font-semibold px-1.5 py-0.5 whitespace-nowrap'>
              GO LIVE!
            </span>
          </div>
          <div className='grid grid-cols-[3fr_1fr] text-xs'>
            <p className='flex flex-row pl-2 items-center'>Bilangan Penonton</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilPenonton`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Reach</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_live_bilReach`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_live_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      ) : null}
      {nama !== 'Youtube' && nama !== 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2'>
          <div className='bg-admin3 flex justify-center items-center text-sm text-adminWhite mb-2 py-2'>
            <span className='text-2xl mr-2'>{logo}</span>
            <span className='text-adminWhite font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
              Poster Infografik
            </span>
          </div>
          <div className='grid grid-cols-[3fr_1fr] text-xs'>
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share kurang 10
            </p>
            <input
              key={nama + '_poster_bilAktivitiShareKurang10'}
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_poster_bilAktivitiShareKurang10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_poster_bilAktivitiShareKurang10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share lebih 10
            </p>
            <input
              key={nama + '_poster_bilAktivitiShareLebih10'}
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_poster_bilAktivitiShareLebih10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_poster_bilAktivitiShareLebih10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Penonton</p>
            <input
              key={nama + '_poster_bilPenonton'}
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_poster_bilPenonton`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_poster_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Reach</p>
            <input
              key={nama + '_poster_bilReach'}
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_poster_bilReach`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_poster_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Share</p>
            <input
              key={nama + '_poster_bilShare'}
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_poster_bilShare`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_poster_bilShare',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      ) : null}
      {nama !== 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2'>
          <div className='bg-admin3 flex justify-center items-center text-sm text-adminWhite py-2 mb-2'>
            <span className='text-2xl mr-2'>{logo}</span>
            <span className='text-adminWhite font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
              Video Promosi/Pendidikan Kesihatan Pergigian
            </span>
          </div>
          <div className='grid grid-cols-[3fr_1fr] text-xs'>
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share kurang 10
            </p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilAktivitiShareKurang10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilAktivitiShareKurang10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>
              Bil. Aktiviti Yang Mendapat Bil. Share lebih 10
            </p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilAktivitiShareLebih10`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilAktivitiShareLebih10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Penonton</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilPenonton`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Reach</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilReach`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Share</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilShare`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilShare',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      ) : null}
      {nama === 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2'>
          <div className='bg-admin3 flex justify-center items-center text-sm text-adminWhite py-2 mb-2'>
            <span className='text-2xl mr-2'>{logo}</span>
            <span className='text-adminWhite font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
              Video Promosi/Pendidikan Kesihatan Pergigian
            </span>
          </div>
          <div className='grid grid-cols-[3fr_1fr] text-xs'>
            <p className='flex flex-row pl-2 items-center'>Bilangan Penonton</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilPenonton`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Reach</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilReach`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
            <p className='flex flex-row pl-2 items-center'>Bilangan Share</p>
            <input
              className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
              value={questionState[`${nama}_video_bilShare`]}
              type='text'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilShare',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      ) : null}
    </div>
  );
};

const RenderSection = (item, props) => {
  return (
    <Section
      key={item.id}
      nama={item.value}
      logo={item.logo}
      questionState={props.questionState}
      setQuestionState={props.setQuestionState}
    />
  );
};

export default RenderSection;
