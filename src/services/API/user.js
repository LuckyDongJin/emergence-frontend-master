/**
 * User related requests, mainly for authentication.
 *
 * Note that we may need to complete this in the futur, to handle forgotten password
 * and email verification.
 */
import Axios from './Axios'
import faker from 'faker'
import localStorageHelpers from '@/helpers/localStorageHelpers'
import store from '@/config/vuex/store'
import {auth} from '@/config/firebase'

// TODO : fake data while the backend is not ready
const randomId = faker.random.uuid()
const token = faker.random.uuid()

export const user = {
  /**
   * Returns a demo unique ID, so that the user can still test out the chat for a few days
   * without the need to authenticate.
   *
   * This way we can push user to signup by allowing them to test the good part of the app
   * without an account.
   * @return {*} [description]
   */
  demo: () => (new Promise((resolve, reject) => {
    localStorage.setItem('userId', randomId)
    resolve({
      id: randomId
    })
  })),
  /**
   * Login, not that we should be able to provide either the username or email for login,
   * this is a good pattern to follow.
   * @param  {*} email    [description]
   * @param  {*} password [description]
   * @return {*}          [description]
   */
  login: ({ email, password }) => (new Promise((resolve, reject) => {
    var vm = this
    // vm.auth.message = ''
    // vm.auth.hasErrors = false

    if (email === '' || password === '') {
      alert('Please provide the email and password')
      return
    }
    console.log(email, password)
    // Sign-in the user with the email and password
    auth.signInWithEmailAndPassword(email, password)
      .then(function (data) {
        vm.auth.user = auth.currentUser
      }).catch(function (error) {
        console.log(error)
        console.log(vm)
        // vm.auth.message = error.message
        // vm.auth.hasErrors = true
      })
    const user = {
      id: randomId,
      name: faker.name.findName(),
      level: 0
    }
    // we memorize user data throughout the app
    localStorageHelpers.setJSONItem('user', user)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', token)
    store.commit('updateUser', user)
    resolve(user)
  })),
  /**
   * Signup
   * @param  {*} user [description]
   * @return {*}      [description]
   */
  signup: (user) => (new Promise((resolve, reject) => {
    // we login the user too
    let vm = this
    // console.log(vm.auth.user)
    // auth.createu({
    //   email: 'user@example.com',
    //   emailVerified: false,
    //   phoneNumber: '+11234567890',
    //   password: 'secretPassword',
    //   displayName: 'John Doe',
    //   photoURL: 'http://www.example.com/12345678/photo.png',
    //   disabled: false})

    auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(function (data) {
        const user = {
          id: randomId,
          name: auth.currentUser.email,
          level: 0
        }
        user.id = randomId
        localStorageHelpers.setJSONItem('user', user)
        localStorage.setItem('userId', randomId)
        localStorage.setItem('token', token)
        store.commit('updateUser', user)
        resolve(user)
      }).catch(function (error) {
        vm.auth.message = error.message
        vm.auth.hasErrors = true
      })
  })),
  /**
   * Update user data
   * @param  {*} user [description]
   * @return {*}      [description]
   */
  update: (user) => (new Promise((resolve, reject) => {
    // thats an update so we conserve existing values when it makes sense
    const currentUser = localStorageHelpers.getJSONItem('user', user)
    localStorageHelpers.setJSONItem('user', { ...currentUser, ...user })
    store.commit('updateUser', { ...currentUser, ...user })
    resolve({ ...currentUser, ...user })
  })),
  /**
   * Logout.
   * NOTE :  we also need to clear the localStorage ! This is very important
   * for security reasons.
   * @return {*} [description]
   */
  logout: () => (new Promise((resolve, reject) => {
    localStorage.clear()
    store.commit('clearUser')
    resolve()
  })),

  _demo: () => (Axios.get('/demo-id').then((randomId) => {
    localStorage.setItem('userId', randomId)
    return randomId
  })),
  _login: ({ email, password }) => (Axios.post('/login', { email, password })
  .then(({ token, user }) => {
    // we memorize user data throughout the app
    localStorageHelpers.setJSONItem('user', user)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', token)
    store.commit('updateUser', user)
    return user
  })),
  _signup: (userInfo) => (Axios.post('/signup', userInfo)
  .then(({ token, user }) => {
    // we login the user too
    localStorageHelpers.setJSONItem('user', user)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', token)
    store.commit('updateUser', user)
  })),
  _update: (user) => (Axios.post('/user/update')
  .then((user) => {
    const currentUser = localStorageHelpers.getJSONItem('user', user)
    localStorageHelpers.setJSONItem('user', { ...currentUser, ...user })
    store.commit('updateUser', { ...currentUser, ...user })
    return { ...currentUser, ...user }
  })),
  _logout: () => (Axios.post('/logout')
  .finally(() => {
    // we clear the localStorage even when the server can't logout for security reasons
    localStorage.clear()
    store.commit('clearUser')
  }))
}

export default user
