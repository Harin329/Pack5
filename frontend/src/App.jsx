import { useEffect, useState } from 'react'
import { Modal, Select, Spin } from 'antd'
import pokemon from 'pokemontcgsdk'
import './App.css'
import Logo from './components/Logo'
import Instruction from './components/Instruction'

function App() {
  const [packMap, setPackMap] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [setList, setSetList] = useState([])
  const [bestPack, setBestPack] = useState()

  pokemon.configure({ apiKey: import.meta.VITE_TCG_API_KEY })

  useEffect(() => {
    pokemon.set.all()
      .then((sets) => {
        setSetList(sets)
      })
  }, [])

  async function findBestPack() {
    setIsModalOpen(true)
    const pricedMap = Object.keys(packMap).map(async (pack) => {
      const set = setList.find((set) => set.id === pack)
      const cards = await pokemon.card.where({ q: `set.id:${set.id}` })
      const sumCost = cards.data.reduce((acc, card) => {
        return acc + (card.cardmarket?.prices?.averageSellPrice ?? 0)
      }
        , 0)
      const cost = sumCost / set.total
      return { ...set, price: cost }
    })

    const finalList = await Promise.all(pricedMap)
    console.log(finalList)
    setBestPack(finalList.sort((a, b) => b.price - a.price)[0])
  }

  return (
    <>
      <Logo />
      <Instruction />
      <div className='searchView'>
        <Select
          className='searchBar'
          size='large'
          showSearch
          placeholder="Enter Pack Name..."
          options={setList.map((pack) => ({ label: `${pack.name} - ${pack.series}`, value: pack.id }))}
          onSelect={(value) => {
            setPackMap({ ...packMap, [value]: 1 })
          }}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      {Object.keys(packMap).map((pack) => {
        const set = setList.find((set) => set.id === pack)
        return (
          <div
            key={pack}
            className='packCard'
            onClick={() => {
              const newPackMap = { ...packMap }
              delete newPackMap[pack]
              setPackMap(newPackMap)
            }}>
            <img src={set.images.logo} height={50} />
            {set.name}
          </div>
        )
      })}
      <div className="search">
        <button onClick={() => { findBestPack() }}>
          Find the Best Pack!
        </button>
      </div>
      <Modal title="The best pack is..."
        open={isModalOpen}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        onOk={() => {
          setIsModalOpen(false)
          setBestPack(null)
        }}>
        {bestPack ?
          <div
            className='packCard'>
            <img src={bestPack.images.logo} height={50} />
            {bestPack.name}
          </div> : <Spin />}
      </Modal>
    </>
  )
}

export default App
