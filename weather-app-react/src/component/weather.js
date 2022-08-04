import {citySearch,cityKey,forecast} from "./fetch.js"
import { useState,useEffect} from "react"
import day from "../img/day.svg"
import night from "../img/night.svg"
import "./style.css"

export const Weather = (props) => {
  const {cityName} = props
  const [data,setdata] = useState()
  const [key,setkey] = useState()
  const [forecastData,setforecastData] = useState()
  const [translate,settranslate] = useState("translate")
  const [added,setadded] = useState("added")

  useEffect(() =>{
    setTimeout(() => {
      translate === "translate"?settranslate("translateBack"):settranslate("")
    },100)
    
    citySearch(cityName)
    .then(data =>{
      data??setkey([])
      setkey(data.data[0])

     cityKey(data.data[0].Key)
     .then(result => {
        result??setdata([])
            setdata(result)
      })
      .catch(error => {
        console.log(error)
      })

      forecast(data.data[0].Key)
      .then(data => {
        console.log(data)
        data??setforecastData([])
      setforecastData(data.data.DailyForecasts)
      })
      .catch(error => {
        console.log(error)
      })

      })
      .catch(error => {
        console.log(error)
      })

},[cityName])

const animation = (clas,time) =>{
  setTimeout(() => {
    setadded(clas)
  },time)
}

const handleClick = () => {
  
  setadded("animation")
  animation("opacity",300)
  animation("added",1000)
  
  let found
  if(localStorage.getItem("city") != null){
    found = JSON.parse(localStorage.getItem("city")).find(ele => ele.toLowerCase() === cityName.toLowerCase())
    }
 
  if(found != undefined) return alert("already in favourites")  

  if(localStorage.getItem("city") === null){
    let array = []
    array.push(cityName)
    localStorage.setItem("city",JSON.stringify(array))
  }else{
      let parsed = JSON.parse(localStorage.getItem("city"))
      parsed.push(cityName)
      localStorage.setItem("city",JSON.stringify(parsed))
  }
}

const icon = (icon) => {
  return `https://developer.accuweather.com/sites/default/files/${icon.toString().length === 1? "0" + icon.toString(): icon}-s.png`
}

  return(
<div className="d-flex justify-content-center mt-3">
     {forecastData? <div className={`card d-flex position-relative ${translate}`} style={{width : "75%", height:"550px",overflow:"hidden"}}>

      {data.data[0].IsDayTime?<img style={{width:"100%"}}  src={day} alt="weather" />:<img style={{width:"100%"}}  src={night} alt="weather" />}

  <div className="d-flex justify-content-between position-absolute" style={{width:"100%"}}>

    <div className={`d-flex flex-row align-items-center text-${data.data[0].IsDayTime?"dark":"light"}`}>
      <img src={icon(data.data[0].WeatherIcon)} className="img-fluid" alt="weather" style={{height:"150px",fill:"blue"}} />
       <div className="d-flex justify-content-center align-items-start flex-column">
      <span style={{fontSize : "30px"}}>{data.data[0].WeatherText}</span>
      <span style={{fontSize : "20px"}} >{`${key.EnglishName}, ${key.Country.EnglishName}`}</span>
      </div>
    </div>

    <div>
      <button onClick={handleClick} className={`${added} btn btn-outline-${data.data[0].IsDayTime?"primary":"light"} mt-3 position-relative`} style={{marginLeft:"30%"}}>Add To Favourites</button>
      <div>
      <p className={`p-5 text-${data.data[0].IsDayTime?"dark":"light"}`} style={{fontSize : "40px"}}>{`${data.data[0].Temperature.Metric.Value}°C / ${data.data[0].Temperature.Imperial.Value}°F`}</p>
      </div>
    </div>
  </div>

    <div className="d-flex absolute position-absolute">
      {forecastData.map((ele,index) => {
          let date = new Date(ele.Date)
          const sliced = date.toDateString().split(" ").slice(0,1)
          let day = sliced.toString()

          return(
          <div key={index} className={`card d-flex flex-column gap-3 align-items-center boxShadow text-${data.data[0].IsDayTime?"dark":"light"}`} style={{width : "800px",height:"300px",backgroundColor:`${data.data[0].IsDayTime?"white":"#36454F"}`}}>
              <h4>{day}</h4>
              <img src={icon(ele.Day.Icon)} className="img-fluid" alt="weather" style={{height:"130px",width:"150px"}} />
              <p className="">Max - {`${ele.Temperature.Maximum.Value}°F`}</p>
              <p>Min - {`${ele.Temperature.Minimum.Value}°F`}</p>
          </div>
          )
      })} 
    </div>
  </div>
  :<h1>Loading...</h1>}
</div>
)
}