import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {BookSearch} from 'react-native-google-books'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email, 
      bookName:"", 
      reasonToRequest:"", 
      isBookRequestActive : "", 
      requestedBookName: "", 
      bookStatus:"", 
      requestId:"", 
      userDocId: '', 
      docId :'',
      dataSource:'',
      showFlatList:true
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  componentDidMount(){
    this.getBookRequest()
    this.isBookRequestActive()
  }
async getBooksFromApi(bookName){
  this.setState({
    bookName:bookName
  })
  if(bookName.length>2){
var books=await BookSearch.searchbook(bookName,'AIzaSyDqXgdXjGeIfxHHvWiuOMEQN7zyuuhe40s')
this.setState({
  dataSource:books.data,
  showFlatList:true
})
  }
  console.log(this.state.dataSource)
}

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
    })
  await this.getBookRequest()
  db.collection('users').where('user_id','==',userId).get()
  .then().then(snapshot=>{
    snapshot.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
        isBookRequestActive:true
      })
    })
  })
    this.setState({
        bookName :'',
        reasonToRequest : '',
        requestId:randomRequestId
    })

    return alert("Book Requested Successfully")
  }
  isBookRequestActive=()=>{
    db.collection('users').where('userId','==',this.state.userId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          userDocId:doc.id
        })
      })
    })
  }
getBookRequest=()=>{
  var bookRequest=db.collection('requested_books').where('userId','==',this.state.userId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      if(doc.data().book_status!="received"){
        this.setState({
          requestedBookName:doc.data().book_status,
          requestId:doc.data().request_id,
          bookStatus:doc.data().book_status,
          docId:doc.Id
        })
      }
    })
  })
}
 renderItem=({item,i})=>{
   return(
     <TouchableHighlight style={{alignItems:'center',backgroundColor:'#000000',padding:10,width:'90%'}} 
     activeOpacity={0.6}
     underlayColor='#000000'
     onPress={()=>{
       this.setState({
         showFlatList:false,
         bookName:item.volumeInfo.title
       })
     }}
     bottomDivider
     >
     <Text>{item.volumeInfo.title}</Text>
     </TouchableHighlight>
   )
 }
  render(){
    if(this.state.isBookRequestActive==true){
      return(
        <View>
        <View>
        <Text>bookName</Text>
        <Text>{this.state.requestedBookName}</Text>
        </View>
        <View>
        <Text>bookStatus</Text>
        <Text>{this.state.bookStatus}</Text>
        </View>
        </View>
      )
    }
    else{
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.getBooksFromApi(text)
                }}
                value={this.state.bookName}
              />
             {(this.state.showFlatlist:true)?(<FlatList data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{marginTop:10}}
              keyExtractor={(item,index)=>{index.toString()}}
              />):( <View style={{alignItems:"center"}}>
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
</View>)}
 
             
            </KeyboardAvoidingView>
        </View>
    )
  }
}
}
const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
