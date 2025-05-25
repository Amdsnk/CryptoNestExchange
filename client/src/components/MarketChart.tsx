import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketChart() {
  const [timeframe, setTimeframe] = useState<string>("1D");
  const [chartType, setChartType] = useState<string>("candle");
  const [priceData, setPriceData] = useState<{
    current: string,
    change: string,
    high: string,
    low: string,
    volume: string,
    timeUpdated: string
  }>({
    current: "$42,384.25",
    change: "+$842.51 (1.95%)",
    high: "$42,850.30",
    low: "$41,290.15", 
    volume: "$2.4B",
    timeUpdated: "Last updated: " + new Date().toLocaleTimeString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Main chart path for candlestick view
  const candleChartUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='hsl(224, 71%25, 4%25)' width='800' height='400'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(40, 220, 160);stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:rgb(40, 220, 160);stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3C!-- Candles --%3E%3Cg%3E%3Crect x='20' y='150' width='10' height='50' fill='rgb(40, 220, 160)' /%3E%3Cline x1='25' y1='140' x2='25' y2='150' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='25' y1='200' x2='25' y2='210' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='50' y='170' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='55' y1='160' x2='55' y2='170' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='55' y1='210' x2='55' y2='220' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='80' y='140' width='10' height='60' fill='rgb(40, 220, 160)' /%3E%3Cline x1='85' y1='130' x2='85' y2='140' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='85' y1='200' x2='85' y2='210' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='110' y='160' width='10' height='50' fill='rgb(40, 220, 160)' /%3E%3Cline x1='115' y1='150' x2='115' y2='160' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='115' y1='210' x2='115' y2='220' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='140' y='170' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='145' y1='160' x2='145' y2='170' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='145' y1='210' x2='145' y2='220' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='170' y='180' width='10' height='30' fill='rgb(235, 87, 87)' /%3E%3Cline x1='175' y1='170' x2='175' y2='180' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='175' y1='210' x2='175' y2='220' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='200' y='160' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='205' y1='150' x2='205' y2='160' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='205' y1='200' x2='205' y2='210' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='230' y='140' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='235' y1='130' x2='235' y2='140' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='235' y1='180' x2='235' y2='190' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='260' y='120' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='265' y1='110' x2='265' y2='120' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='265' y1='160' x2='265' y2='170' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='290' y='100' width='10' height='30' fill='rgb(40, 220, 160)' /%3E%3Cline x1='295' y1='90' x2='295' y2='100' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='295' y1='130' x2='295' y2='140' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='320' y='120' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='325' y1='110' x2='325' y2='120' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='325' y1='160' x2='325' y2='170' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='350' y='140' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='355' y1='130' x2='355' y2='140' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='355' y1='180' x2='355' y2='190' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='380' y='160' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='385' y1='150' x2='385' y2='160' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='385' y1='200' x2='385' y2='210' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='410' y='150' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='415' y1='140' x2='415' y2='150' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='415' y1='190' x2='415' y2='200' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='440' y='120' width='10' height='50' fill='rgb(40, 220, 160)' /%3E%3Cline x1='445' y1='110' x2='445' y2='120' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='445' y1='170' x2='445' y2='180' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='470' y='90' width='10' height='50' fill='rgb(40, 220, 160)' /%3E%3Cline x1='475' y1='80' x2='475' y2='90' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='475' y1='140' x2='475' y2='150' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='500' y='70' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='505' y1='60' x2='505' y2='70' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='505' y1='110' x2='505' y2='120' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='530' y='90' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='535' y1='80' x2='535' y2='90' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='535' y1='130' x2='535' y2='140' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='560' y='110' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='565' y1='100' x2='565' y2='110' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='565' y1='150' x2='565' y2='160' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='590' y='120' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='595' y1='110' x2='595' y2='120' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='595' y1='160' x2='595' y2='170' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='620' y='90' width='10' height='50' fill='rgb(40, 220, 160)' /%3E%3Cline x1='625' y1='80' x2='625' y2='90' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='625' y1='140' x2='625' y2='150' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='650' y='70' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='655' y1='60' x2='655' y2='70' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='655' y1='110' x2='655' y2='120' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='680' y='40' width='10' height='60' fill='rgb(40, 220, 160)' /%3E%3Cline x1='685' y1='30' x2='685' y2='40' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='685' y1='100' x2='685' y2='110' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='710' y='30' width='10' height='40' fill='rgb(40, 220, 160)' /%3E%3Cline x1='715' y1='20' x2='715' y2='30' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='715' y1='70' x2='715' y2='80' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Crect x='740' y='50' width='10' height='40' fill='rgb(235, 87, 87)' /%3E%3Cline x1='745' y1='40' x2='745' y2='50' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Cline x1='745' y1='90' x2='745' y2='100' stroke='rgb(235, 87, 87)' stroke-width='2' /%3E%3Crect x='770' y='70' width='10' height='30' fill='rgb(40, 220, 160)' /%3E%3Cline x1='775' y1='60' x2='775' y2='70' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3Cline x1='775' y1='100' x2='775' y2='110' stroke='rgb(40, 220, 160)' stroke-width='2' /%3E%3C/g%3E%3C!-- Volume histogram --%3E%3Cg%3E%3Crect x='20' y='350' width='10' height='20' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='50' y='350' width='10' height='30' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='80' y='350' width='10' height='25' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='110' y='350' width='10' height='15' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='140' y='350' width='10' height='20' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='170' y='350' width='10' height='10' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='200' y='350' width='10' height='25' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='230' y='350' width='10' height='30' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='260' y='350' width='10' height='35' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='290' y='350' width='10' height='40' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='320' y='350' width='10' height='30' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='350' y='350' width='10' height='20' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='380' y='350' width='10' height='15' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='410' y='350' width='10' height='25' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='440' y='350' width='10' height='35' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='470' y='350' width='10' height='45' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='500' y='350' width='10' height='50' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='530' y='350' width='10' height='40' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='560' y='350' width='10' height='30' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='590' y='350' width='10' height='25' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='620' y='350' width='10' height='35' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='650' y='350' width='10' height='45' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='680' y='350' width='10' height='50' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='710' y='350' width='10' height='30' fill='rgba(40, 220, 160, 0.5)' /%3E%3Crect x='740' y='350' width='10' height='20' fill='rgba(235, 87, 87, 0.5)' /%3E%3Crect x='770' y='350' width='10' height='25' fill='rgba(40, 220, 160, 0.5)' /%3E%3C/g%3E%3C!-- Grid lines --%3E%3Cg%3E%3Cline x1='0' y1='350' x2='800' y2='350' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='300' x2='800' y2='300' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='250' x2='800' y2='250' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='200' x2='800' y2='200' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='150' x2='800' y2='150' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='100' x2='800' y2='100' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='50' x2='800' y2='50' stroke='rgba(255,255,255,0.1)' /%3E%3C/g%3E%3C!-- Left axis labels --%3E%3Cg fill='rgba(255,255,255,0.6)'%3E%3Ctext x='5' y='350' font-size='10'>42000</text%3E%3Ctext x='5' y='300' font-size='10'>42200</text%3E%3Ctext x='5' y='250' font-size='10'>42400</text%3E%3Ctext x='5' y='200' font-size='10'>42600</text%3E%3Ctext x='5' y='150' font-size='10'>42800</text%3E%3Ctext x='5' y='100' font-size='10'>43000</text%3E%3Ctext x='5' y='50' font-size='10'>43200</text%3E%3C/g%3E%3C!-- Time markers --%3E%3Cg fill='rgba(255,255,255,0.6)'%3E%3Ctext x='20' y='370' font-size='8'>09:00</text%3E%3Ctext x='140' y='370' font-size='8'>11:00</text%3E%3Ctext x='260' y='370' font-size='8'>13:00</text%3E%3Ctext x='380' y='370' font-size='8'>15:00</text%3E%3Ctext x='500' y='370' font-size='8'>17:00</text%3E%3Ctext x='620' y='370' font-size='8'>19:00</text%3E%3Ctext x='740' y='370' font-size='8'>21:00</text%3E%3C/g%3E%3C!-- Moving averages --%3E%3Cpath fill='none' stroke='rgba(255, 165, 0, 0.6)' stroke-width='1.5' stroke-dasharray='5,3' d='M20,180 C50,175 80,170 110,165 C140,160 170,155 200,145 C230,135 260,125 290,110 C320,105 350,110 380,120 C410,115 440,100 470,85 C500,75 530,85 560,95 C590,90 620,80 650,70 C680,50 710,45 740,60 C770,65' /%3E%3Cpath fill='none' stroke='rgba(123, 104, 238, 0.6)' stroke-width='1.5' d='M20,190 C50,185 80,180 110,175 C140,175 170,170 200,165 C230,155 260,145 290,135 C320,130 350,135 380,140 C410,135 440,125 470,115 C500,105 530,110 560,115 C590,110 620,105 650,95 C680,75 710,70 740,80 C770,85' /%3E%3C!-- Trading indicators --%3E%3Cg%3E%3Ccircle cx='110' cy='165' r='5' fill='rgba(255, 69, 0, 0.7)' stroke='white' stroke-width='1' /%3E%3Ctext x='115' y='155' font-size='10' fill='white'>Sell</text%3E%3Ccircle cx='350' cy='140' r='5' fill='rgba(255, 69, 0, 0.7)' stroke='white' stroke-width='1' /%3E%3Ctext x='355' y='130' font-size='10' fill='white'>Sell</text%3E%3Ccircle cx='470' cy='85' r='5' fill='rgba(34, 139, 34, 0.7)' stroke='white' stroke-width='1' /%3E%3Ctext x='475' y='75' font-size='10' fill='white'>Buy</text%3E%3Ccircle cx='680' cy='40' r='5' fill='rgba(34, 139, 34, 0.7)' stroke='white' stroke-width='1' /%3E%3Ctext x='685' y='30' font-size='10' fill='white'>Buy</text%3E%3C/g%3E%3C/svg%3E";

  // Line chart for simpler view
  const lineChartUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='hsl(224, 71%25, 4%25)' width='800' height='400'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(40, 220, 160);stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:rgb(40, 220, 160);stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='none' stroke='rgb(40, 220, 160)' stroke-width='2' d='M0,300 C100,280 150,220 200,250 C250,280 300,240 350,220 C400,200 450,260 500,150 C550,50 600,100 650,120 C700,140 750,180 800,150' /%3E%3Cpath fill='url(%23grad)' d='M0,300 C100,280 150,220 200,250 C250,280 300,240 350,220 C400,200 450,260 500,150 C550,50 600,100 650,120 C700,140 750,180 800,150 L800,400 L0,400 Z' /%3E%3C!-- Grid lines --%3E%3Cg%3E%3Cline x1='0' y1='350' x2='800' y2='350' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='300' x2='800' y2='300' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='250' x2='800' y2='250' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='200' x2='800' y2='200' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='150' x2='800' y2='150' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='100' x2='800' y2='100' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='0' y1='50' x2='800' y2='50' stroke='rgba(255,255,255,0.1)' /%3E%3C/g%3E%3Cg%3E%3Cline x1='100' y1='0' x2='100' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='200' y1='0' x2='200' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='300' y1='0' x2='300' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='400' y1='0' x2='400' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='500' y1='0' x2='500' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='600' y1='0' x2='600' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3Cline x1='700' y1='0' x2='700' y2='400' stroke='rgba(255,255,255,0.1)' /%3E%3C/g%3E%3C!-- Left axis labels --%3E%3Cg fill='rgba(255,255,255,0.6)'%3E%3Ctext x='5' y='350' font-size='10'>42000</text%3E%3Ctext x='5' y='300' font-size='10'>42200</text%3E%3Ctext x='5' y='250' font-size='10'>42400</text%3E%3Ctext x='5' y='200' font-size='10'>42600</text%3E%3Ctext x='5' y='150' font-size='10'>42800</text%3E%3Ctext x='5' y='100' font-size='10'>43000</text%3E%3Ctext x='5' y='50' font-size='10'>43200</text%3E%3C/g%3E%3C!-- Time markers --%3E%3Cg fill='rgba(255,255,255,0.6)'%3E%3Ctext x='20' y='370' font-size='8'>09:00</text%3E%3Ctext x='140' y='370' font-size='8'>11:00</text%3E%3Ctext x='260' y='370' font-size='8'>13:00</text%3E%3Ctext x='380' y='370' font-size='8'>15:00</text%3E%3Ctext x='500' y='370' font-size='8'>17:00</text%3E%3Ctext x='620' y='370' font-size='8'>19:00</text%3E%3Ctext x='740' y='370' font-size='8'>21:00</text%3E%3C/g%3E%3C/svg%3E";

  const handleTimeframeClick = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    
    // Update price data based on timeframe
    const newPriceData = {
      ...priceData,
      timeUpdated: "Last updated: " + new Date().toLocaleTimeString()
    };
    
    if (newTimeframe === "1D") {
      newPriceData.high = "$42,850.30";
      newPriceData.low = "$41,290.15";
      newPriceData.volume = "$2.4B";
    } else if (newTimeframe === "1W") {
      newPriceData.high = "$43,925.80";
      newPriceData.low = "$40,125.60";
      newPriceData.volume = "$18.7B";
    } else if (newTimeframe === "1M") {
      newPriceData.high = "$48,750.20";
      newPriceData.low = "$38,980.45";
      newPriceData.volume = "$76.3B";
    } else if (newTimeframe === "1Y") {
      newPriceData.high = "$68,925.30";
      newPriceData.low = "$26,780.90";
      newPriceData.volume = "$892.5B";
    }
    
    setPriceData(newPriceData);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Generate mock price data for the chart
  const generateMockPriceData = (timeframe: string) => {
    const now = new Date();
    const data = [];
    let numPoints = 0;
    let startingPrice = 42000;
    
    // Determine number of data points based on timeframe
    switch (timeframe) {
      case "1D":
        numPoints = 24;
        break;
      case "1W":
        numPoints = 7;
        break;
      case "1M":
        numPoints = 30;
        break;
      case "1Y":
        numPoints = 12;
        break;
      default:
        numPoints = 24;
    }

    // Generate price data points
    for (let i = 0; i < numPoints; i++) {
      const time = new Date(now);
      
      if (timeframe === "1D") {
        time.setHours(now.getHours() - (numPoints - i));
      } else if (timeframe === "1W") {
        time.setDate(now.getDate() - (numPoints - i));
      } else if (timeframe === "1M") {
        time.setDate(now.getDate() - (numPoints - i));
      } else if (timeframe === "1Y") {
        time.setMonth(now.getMonth() - (numPoints - i));
      }
      
      // Add some random price movement
      const priceDelta = startingPrice * (Math.random() * 0.08 - 0.04);
      startingPrice += priceDelta;
      
      data.push({
        time: time.getTime() / 1000,
        value: startingPrice,
      });
    }
    
    return data;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">BTC/USDT Market</h3>
            <p className="text-xs text-muted-foreground">{priceData.timeUpdated}</p>
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              className={chartType === "candle" ? "bg-muted" : ""}
              onClick={() => setChartType("candle")}
            >
              Candle
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={chartType === "line" ? "bg-muted" : ""}
              onClick={() => setChartType("line")}
            >
              Line
            </Button>
          </div>
        </div>
        
        {/* Price Statistics */}
        <div className="flex items-center justify-between space-x-2 mb-4">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-6 w-36" />
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-foreground">{priceData.current}</span>
                  <span className="ml-2 text-sm font-medium text-success">{priceData.change}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <span>High: <span className="text-foreground">{priceData.high}</span></span>
                  <span>Low: <span className="text-foreground">{priceData.low}</span></span>
                  <span>Vol: <span className="text-foreground">{priceData.volume}</span></span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant={timeframe === "1D" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTimeframeClick("1D")}
            >
              1D
            </Button>
            <Button 
              variant={timeframe === "1W" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTimeframeClick("1W")}
            >
              1W
            </Button>
            <Button 
              variant={timeframe === "1M" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTimeframeClick("1M")}
            >
              1M
            </Button>
            <Button 
              variant={timeframe === "1Y" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTimeframeClick("1Y")}
            >
              1Y
            </Button>
          </div>
        </div>
        
        {/* Chart */}
        {isLoading ? (
          <Skeleton className="w-full h-[350px] rounded-lg" />
        ) : (
          <div className="relative">
            <div 
              ref={chartContainerRef} 
              className="w-full h-[350px] rounded-lg bg-card" 
              style={{
                backgroundImage: `url("${chartType === 'candle' ? candleChartUrl : lineChartUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* Chart Legend */}
            <div className="absolute top-3 right-3 bg-card/70 backdrop-blur-sm rounded p-2 border border-border">
              <div className="flex flex-col space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-[rgb(40,220,160)] mr-2"></div>
                  <span>Price</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-[rgba(255,165,0,0.6)] mr-2" style={{borderTop: '1px dashed rgba(255,165,0,0.6)'}}></div>
                  <span>MA (7)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-[rgba(123,104,238,0.6)] mr-2"></div>
                  <span>MA (25)</span>
                </div>
              </div>
            </div>
            
            {/* Chart Trading Indicators */}
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <div>RSI: <span className="text-foreground">58.2</span></div>
              <div>MACD: <span className="text-success">Bullish</span></div>
              <div>Vol: <span className="text-foreground">+15.3%</span></div>
              <div>ATR: <span className="text-foreground">845.2</span></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
