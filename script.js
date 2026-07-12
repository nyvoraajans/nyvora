'use strict'

const header=document.querySelector('.site-header')
const menuButton=document.querySelector('.menu-toggle')
const nav=document.querySelector('.nav')
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches

const setHeader=()=>header.classList.toggle('scrolled',window.scrollY>24)
setHeader()
window.addEventListener('scroll',setHeader,{passive:true})

const closeMenu=()=>{
  menuButton.classList.remove('active')
  menuButton.setAttribute('aria-expanded','false')
  menuButton.setAttribute('aria-label','Menüyü aç')
  nav.classList.remove('open')
  document.body.classList.remove('menu-open')
}

menuButton.addEventListener('click',()=>{
  const open=!nav.classList.contains('open')
  menuButton.classList.toggle('active',open)
  menuButton.setAttribute('aria-expanded',String(open))
  menuButton.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç')
  nav.classList.toggle('open',open)
  document.body.classList.toggle('menu-open',open)
})

document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',closeMenu))
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()})
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu()},{passive:true})

const counters=document.querySelectorAll('.counter')
const animateCounter=element=>{
  const target=Number(element.dataset.target)
  const start=performance.now()
  const duration=1400
  const update=now=>{
    const progress=Math.min((now-start)/duration,1)
    const eased=1-Math.pow(1-progress,4)
    element.textContent=Math.round(target*eased)
    if(progress<1)requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

if('IntersectionObserver'in window&&!reduceMotion){
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },{threshold:.12,rootMargin:'0px 0px -45px'})
  document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element))
  const counterObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  },{threshold:.65})
  counters.forEach(counter=>counterObserver.observe(counter))
}else{
  document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'))
  counters.forEach(counter=>counter.textContent=counter.dataset.target)
}

if(!reduceMotion&&window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.magnetic').forEach(element=>{
    element.addEventListener('pointermove',event=>{
      const rect=element.getBoundingClientRect()
      const x=(event.clientX-rect.left-rect.width/2)*.13
      const y=(event.clientY-rect.top-rect.height/2)*.13
      element.style.transform=`translate3d(${x}px,${y}px,0)`
    })
    element.addEventListener('pointerleave',()=>element.style.transform='')
  })
}

document.querySelector('#year').textContent=new Date().getFullYear()
