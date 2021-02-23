(() => {
  // DOM********************************
  const sections = document.querySelectorAll('section')
  const container = document.querySelector('.container')
  const section1Chars = document.querySelectorAll('.character')
  const emojiMessage = document.querySelector('.emoji-container .message')
  const emoji = document.querySelector('.emoji-container .emoji')
  const section2Canvas = document.querySelector('.section-2-canvas')
  const section2CanvasCtx = section2Canvas.getContext('2d')
  const section3Img = document.querySelector('.needles-shirt')
  // DECS******************************
  let totalWidth = 0
  let rafState = false
  let rafId = 0
  let horPos = 0
  let io
  const speed = 0.1
  let curSection = 0
  let sectionChange = false
  let imgs = []
  let imgLoaded = 0

  // const io = new IntersectionObserver(entries => {
  //   const entry = entries[0]
  //   if (!entry.isIntersecting) return
  //   console.log(entry.target)
  // })

  // FUNCTIONS****************************
  function loadImgs() {
    let img
    for (let i = 0; i < 2; i++) {
      img = new Image()
      img.src = `./images/needles_${i}.png`
      imgs.push(img)
    }
  }

  function observeSections() {
    sections.forEach(section => {
      io.observe(section)
    })
  }

  function setCanvasSizes() {
    section2CanvasCtx.canvas.width = screen.width
    section2CanvasCtx.canvas.height = screen.height
  }

  function getTotalWidth() {
    totalWidth = Array.from(sections).reduce((acc, section) => acc + section.offsetWidth, 0)
  }

  function checkScrollValid() {
    if (window.pageYOffset < 0) return false
    if (window.pageYOffset > totalWidth) return false
    return true
  }

  function setBodyHeight() {
    document.body.style.height = `${screen.height + (totalWidth - screen.width)}px`
  }

  function ioCallback(entries) {
    if (!entries.some(entry => entry.isIntersecting)) return
    const curEntry = entries.find(entry => entry.isIntersecting)
    curSection = Number(curEntry.target.dataset.index)
    sectionChange = true
  }

  function updateHorPos() {
    horPos += (window.pageYOffset - horPos) * speed
    container.style.transform = `translate3d(-${horPos}px, 0, 0)`
    if (Math.abs(window.pageYOffset - horPos) < 1) {
      cancelAnimationFrame(rafId)
      horPos = window.pageYOffset
      rafState = false
      return
    }
    rafId = requestAnimationFrame(updateHorPos)
  }

  function colorChange(newBgColor, newColor) {
    sections[curSection].style.backgroundColor = newBgColor
    sections[curSection].style.color = newColor
  }

  function charactersFadeIn(charArr) {
    charArr.forEach((char, index) => {
      char.style.animation = `fade-in 0.3s linear ${index * 0.2}s forwards`
    })
  }

  function animateSection2() {
    let randomX, randomY, randomSize, randomRotate
    section2CanvasCtx.fillRect(0, 0, section2Canvas.width, section2Canvas.height)
    for (let i = 0; i < 100; i++) {
      console.log('draw')
      randomX = Math.floor(Math.random() * screen.width) - 50
      randomY = Math.floor(Math.random() * screen.height) - 50
      randomSize = Math.floor(Math.random() * 80) + 30
      randomRotate = Math.floor(Math.random() * -25)
      section2CanvasCtx.translate(randomX, randomY)
      section2CanvasCtx.rotate(randomRotate * Math.PI / 180)
      section2CanvasCtx.drawImage(imgs[0], 0, 0, 352, 352, randomX, randomY, randomSize, randomSize)
      section2CanvasCtx.setTransform(1, 0, 0, 1, 0, 0)
    }
  }

  function animateSection3() {
    section3Img.style.animation = `rotate-in 1.5s 0.5s cubic-bezier(0.28, 1.72, 0.37, 0.74) forwards`
  }

  function handleSectionChange() {
    switch(curSection) {
      case 0:
        emojiMessage.innerText = 'Swipe down!\nA bit slowly :D'
        break
      case 1:
        charactersFadeIn(section1Chars)
        emojiMessage.innerText = 'Corny message!'
        colorChange('black', '#e5e3e7')
        break
      case 2:
        animateSection2()
        emojiMessage.innerText = 'Hmm, a hint?'
        break
      case 3:
        animateSection3()
        emojiMessage.innerText = 'Ohhh'
        colorChange('#e5e3e7', 'black')
        break
      case 4:
        emojiMessage.innerText = 'Happy Birthday!'
        break
      default:
        break
    }
  }

  // INIT********************************
  function init() {
    // get total width
    getTotalWidth()
    // set body height
    setBodyHeight()
    // set canvas sizes
    setCanvasSizes()
    // start i.o. on sections
    io = new IntersectionObserver(ioCallback, {
      threshold: 0.2
    })
    observeSections()
    // add scroll e.l.
    window.addEventListener('scroll', () => {
      console.log(curSection)
      // if scroll less than 0 or max scrollable dis, return
      if (!checkScrollValid) return
      // update horizontal scroll position based on vertical scroll on body
      if (!rafState) {
        rafId = requestAnimationFrame(updateHorPos)
        rafState = true;
      }
      // if there's section change, call app. function
      if (sectionChange) {
        handleSectionChange()
        sectionChange = false
      }
    })
  }

  function refreshPage() {
    window.scrollTo(0, 0)
    location.reload()
  }

  // EVENT LISTENERS**********************
  loadImgs()
  window.addEventListener('load', init)
//   window.addEventListener('resize', refreshPage)
})()
