import { create } from 'zustand';
import Parse from 'parse/dist/parse.min.js';
import { toast } from 'react-toastify';

export const useUserStore = create((set) => ({
  currentUser: null,
  loading: false,
  isLoading: false,
  setCurrentUser: (user) => set({currentUser: user, isLoading: false}),
  login: async (email,password) => {
    set({isloading: true})
    try{
      const user = await Parse.User.logIn(email,password);
      set({currentUser: user})
      return user;
    }catch(err) {
      toast.error('Login Failed ' + err.message);
      console.log(err.message);
      set({currentUser: null});
      throw err;
    }finally {
      set({isloading: false})
    }
 },
 logout: async () => {
  set({loading: true})
  try{
    await Parse.User.logOut();
    set({currentUser: null, isLoading: false,loading: false});
  }catch(err) {
    toast.error("Logout Failed"+err.message);
    console.log(err.message);
    throw err;
  }finally {
    set({loading: false})
  }
 },
 signin: async (email,username,password,avatarFile) => {
  set({loading: true})
  try {
    const createdUser = await Parse.User.signUp(email, password);     
      
    createdUser.set('userName', username);
    createdUser.set('email',email);
    createdUser.set('blocked', []);

    let parseFile = null;
      if(avatarFile.name) {
          parseFile = new Parse.File(avatarFile.name, avatarFile);
          await parseFile.save();
      } 

    if(parseFile) {
      createdUser.set('avatar',parseFile);
    }

    await createdUser.save();



    toast.success(`Success! User ${createdUser.getUsername()} was successfully created!`);
    set({loading: false})

  } catch (error) {
    toast.error('Error signing up:'+ error.message);
    console.log(error.message);
  } finally {
    set({loading: false}) 
  }
 }
}));

export const initializeCurrentUser = () => {
  const {setCurrentUser} = useUserStore.getState();
  const user = Parse.User.current();
  if(user) {
    setCurrentUser(user);
  }
};

export const useChatStore = create((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => {
    set({selectedChat: chat});
  }
}))

