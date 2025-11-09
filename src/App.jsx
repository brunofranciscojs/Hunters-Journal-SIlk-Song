import { useEffect, useState } from 'react'
import Arrow from './components/arrowIcon';
import Loading from './components/Loading';

function App() {
  const [enemies, setEnemies] = useState([])
  const [active,setActive] = useState('Lace');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const getEnemies = async () => {
    try {
      const EXPIRATION_TIME = 72 * 60 * 60 * 1000;
      const cachedData = localStorage.getItem("enemies");
      const cachedTime = localStorage.getItem("enemies_timestamp");

      if (cachedData && cachedTime && Date.now() - cachedTime < EXPIRATION_TIME) {
        console.log("⚡ Usando cache local válido");
        setEnemies(JSON.parse(cachedData));
        return;
      }

      setLoading(true);
      console.log("🌐 Buscando da API...");

      const res = await fetch("https://silksong-api.onrender.com/api/enemies");
      const data = await res.json();
      const enemiesList = data.data;

      const details = await Promise.all(
        enemiesList.map(async (enemy) => {
          const res = await fetch(
            `https://silksong-api.onrender.com/api/enemy/${enemy.slug}`
          );
          const detail = await res.json();

          return {
            ...enemy,
            image: detail.image,
            description: detail.description,
            hornetDescription: detail.hornetDescription,
          };
        })
      );

      localStorage.setItem("enemies", JSON.stringify(details));
      localStorage.setItem("enemies_timestamp", Date.now());
      setEnemies(details);

    } catch (err) {
      console.error("❌ Erro ao buscar inimigos:", err);
    } finally {
      setLoading(false);
    }
  };

  getEnemies();
}, []);

 if (loading) {
    return (
     <main className='hidden lg:flex gap-8 w-svw px-12 h-dvh items-end justify-center'>
        <section className='flex flex-col justify-center items-center gap-5 pt-20 before:hidden'>
          <Loading />
        </section>
  
        <section className='flex flex-col justify-center items-center gap-5 pt-20'>
          <Loading />
        </section>
  
        <section className='flex flex-col justify-center items-center gap-5 pt-20'>
          <Loading />
        </section>
      </main>
    );
  }

  const ativar = (index) =>{
    document.startViewTransition(() =>{
      setActive(index);
    })
  }

  return (
    <>
      <main className='hidden lg:flex gap-8 w-svw px-12 h-dvh items-end justify-center'>
        <section className='flex flex-col justify-center items-center gap-5 pt-20'>

          <Arrow className={'mx-auto block cursor-pointer z-50 relative'}/>
          
          <div className='relative z-10'>
            <div className='h-20 bg-[linear-gradient(to_bottom,#242424_10%,transparent_100%)] absolute top-0 left-0 w-full z-10 pointer-events-none'></div>
            <ul className="w-full h-full overflow-y-auto max-h-[590px] flex px-10 flex-wrap relative mx-auto justify-center items-center gap-y-10 z-0 [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-[#555]">
              {enemies.slice(1).map((enemy, key) => (
                <li key={key} className={`w-1/3 relative cursor-pointer ${active === enemy.slug ? '[anchor-name:--active]' : ''}`} data-active={active === enemy.slug} onClick={() => ativar(enemy.slug)}>
                  <img  src={enemy.image} className='rounded-full w-20 h-20 border-3 border-white/80 block object-cover mx-auto' />
                </li>
                ))
              }
            </ul>
            <div className='h-24 bg-[linear-gradient(to_top,#242424_10%,transparent_100%)] absolute bottom-0 left-0 w-full z-10 pointer-events-none'></div>
          </div>
  
          <Arrow className={'mx-auto block scale-[1_-1] cursor-pointer z-50'}/>
        </section>
  
        <section>
            {active && (() => {
              const enemy = enemies.find(e => e.slug === active);
              return (
                <div className="place-content-center w-full mx-auto relative">
                  <img
                    src={enemy ? enemy.image : "https://cdn.wikimg.net/en/hkwiki/images/thumb/7/71/B_Skarrsinger_Karmelita.png/300px-B_Skarrsinger_Karmelita.png"}
                    key={enemy?.slug || "default"}
                    alt={enemy?.name || "default"}
                    className={`block mx-auto w-auto relative min-w-84 z-10 ${enemy ? 'brightness-150 saturate-[1.5]' : ''}`}
                  />
                  {enemy && (
                    <div
                      className="blur-[5rem] rounded-full absolute z-0 w-[300px] h-[300px] left-1/2 top-1/2 [translate:-50%_-50%] saturate-[2] bg-cover bg-center brightness-150"
                      style={{ backgroundImage: `url(${enemy.image})` }}
                    />
                  )}
                </div>
              );
            })()}
        </section>
  
        <section>
            {active && (() => {
              const enemy = enemies.find(e => e.slug === active);
              if (!enemy) return null;
  
              return (
                  <div className='place-content-center w-full mx-auto relative px-10 flex justify-between flex-col h-[80%] py-12'>
                    <div>
                      <h2 className='font-bold text-4xl text-white text-center mb-7'>{enemy.name}</h2>
                      <span className='block max-w-[85%] mx-auto text-2xl text-white/60'>{enemy.description}</span>
                    </div>
                    
                    {enemy.hornetDescription !== '...' &&
                      <div>
                        <img src="./src/assets/hd.png" className="mx-auto block w-auto mb-7" />
                        <span className='block max-w-[85%] mx-auto text-2xl text-white/60'>{enemy.hornetDescription}</span>
                      </div>
                    }
  
                    <div className='h-12 opacity-0'>
  
                    </div>
                  </div>
              );
            })()}
        </section>
      </main>
      <span className='flex lg:hidden text-white text-3xl justify-center'>OPEN ON DESKTOP OR ON A SCREEN LARGER THAN 1024PX</span>
    </>
  )
}

export default App
