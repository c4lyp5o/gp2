const Section = ({ nama, img, questionState, setQuestionState }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionState({ ...questionState, [name]: value });
  };

  return (
    <div className='grid grid-cols-3 overflow-y-auto overflow-x-hidden'>
      {nama !== 'Twitter' ? (
        <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2 p-2'>
          <img className='w-1/4 mx-auto mt-2' src={img} alt='logo' />
          <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
            GO LIVE!
          </span>
          <div className='grid grid-cols-2 text-xs'>
            <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
            <input
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
            <input
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Penonton</p>
            <input
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Reach</p>
            <input
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Share</p>
            <input
              className='border-2 mb-1 rounded-md'
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
      {nama !== 'Youtube' && nama !== 'Tiktok' ? (
        <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2 p-2'>
          <img className='w-1/4 mx-auto mt-2' src={img} alt='logo' />
          <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
            Poster Infografik
          </span>
          <div className='grid grid-cols-2 text-xs'>
            <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
            <input
              key={nama + '_poster_bilAktivitiShareKurang10'}
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
            <input
              key={nama + '_poster_bilAktivitiShareLebih10'}
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Penonton</p>
            <input
              key={nama + '_poster_bilPenonton'}
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Reach</p>
            <input
              key={nama + '_poster_bilReach'}
              className='border-2 mb-1 rounded-md'
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
            <p>Bil. Share</p>
            <input
              key={nama + '_poster_bilShare'}
              className='border-2 mb-1 rounded-md'
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
      <article className='col-span-1 bg-admin4 border-admin2 rounded-lg shadow-md overflow-hidden m-2 p-2'>
        <img className='w-1/4 mx-auto mt-2' src={img} alt='logo' />
        <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
          Video Promosi/Pendidikan Kesihatan Pergigian
        </span>
        <div className='grid grid-cols-2 text-xs'>
          <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
          <input
            className='border-2 mb-1 rounded-md'
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
          <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
          <input
            className='border-2 mb-1 rounded-md'
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
          <p>Bil. Penonton</p>
          <input
            className='border-2 mb-1 rounded-md'
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
          <p>Bil. Reach</p>
          <input
            className='border-2 mb-1 rounded-md'
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
          <p>Bil. Share</p>
          <input
            className='border-2 mb-1 rounded-md'
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
    </div>
  );
};

const RenderSection = (item, props) => {
  return (
    <Section
      key={item.id}
      nama={item.value}
      img={item.img}
      questionState={props.questionState}
      setQuestionState={props.setQuestionState}
    />
  );
};

export default RenderSection;
