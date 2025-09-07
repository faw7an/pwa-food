self.addEventListener('install',(evt)=>{
    console.log('Service worker has been installed');
})

// activate evt
self.addEventListener('activate',(evt)=>{
    console.log('Service worker has been activated');
})

// fetch event
 self.addEventListener('fetch',(evt)=>{
    console.log('fetch event triggered',evt);
})
