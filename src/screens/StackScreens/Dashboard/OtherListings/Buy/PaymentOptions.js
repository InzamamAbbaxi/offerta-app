import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

////////navigation////////////////
import { useIsFocused } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";
//////////////////app components///////////////
import CustomHeader from "../../../../../components/Header/CustomHeader";
import CustomButtonhere from "../../../../../components/Button/CustomButton";
import CustomTextInput from "../../../../../components/TextInput/CustomTextInput";
import ShippingAddressCard from "../../../../../components/CustomCards/ShippingAddressCard";
import NoDataFound from "../../../../../components/NoDataFound/NoDataFound";

////////////////country picker package/////////////
import CountryPicker from "react-native-country-picker-modal";

/////////////app styles////////////////
import styles from "./styles";
import Colors from "../../../../../utills/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

//////////////////////////app api/////////////////////////
import axios from "axios";
import { BASE_URL } from "../../../../../utills/ApiRootUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

//////////////api function//////////
import { get_Shipping_Address } from "../../../../../api/ShippingAddress";

////////////////redux//////////////
import {
  setOrderShippingAddress,
  setLoginUserShippingAddress,
} from "../../../../../redux/LoginUserActions";
import { useDispatch, useSelector } from "react-redux";
import { fontFamily } from "../../../../../constant/fonts";
import TranslationStrings from "../../../../../utills/TranslationStrings";
import Loader from "../../../../../components/Loader/Loader";
import { get_specific_user_detail } from "../../../../../api/GetApis";

const PaymentOptions = ({ navigation, route }) => {
  const [selected_index, setSelected_index] = useState(-1);
  const [loading, setLoading] = useState(false);
  console.log("route?.params : ", route?.params);

  const handlePress = async (index) => {
    setSelected_index(index);
    console.log("index  : ", index);

    if (index == 1) {
      getDAta();
    }
    if (index == 0) {
      navigation.replace("PaymentMethods1", {
        index: index,
        listing_user_detail: route?.params?.listing_user_detail,
      });
    } else if (index !== 1) {
      navigation.replace("ConfirmAddress", {
        index: index,
        listing_user_detail: route?.params?.listing_user_detail,
      });
    }
  };

  const getDAta = async () => {
    setLoading(true);
    var user_id = await AsyncStorage.getItem("Userid");
    let user_detail = await get_specific_user_detail(user_id);
    console.log("user_detail  :  ", user_detail?.user_name);

    let url = `http://ofertasvapp.com/testing/offerta-sv/offerta-backend/v1/payment/cryptoInit.php?amount=1&customer_name=${user_detail?.user_name}`;
    console.log("url : ", url);
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        console.log("response : ", response);
        let payment_url = response[0]?.payment_url;
        console.log("payment_url  : ", payment_url);
        // navigation.navigate("Coinbase", route?.params);
        navigation.navigate("Coinbase", {
          payment_url: payment_url,
        });
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Loader isLoading={loading} />
        <CustomHeader
          headerlabel={TranslationStrings.BUY}
          // headerlabel={"fksdjfksdjk"}
          iconPress={() => {
            navigation.goBack();
          }}
          icon={"arrow-back"}
        />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.Appthemecolor,
              fontFamily: fontFamily.Poppins_Bold,
              marginBottom: 30,
            }}
          >
            {TranslationStrings.CHOOSE_PAYMENT_METHOD}
          </Text>
          {route?.params?.listing_user_detail?.verify_status == "verified" && (
            <>
              {(route?.params?.listing_user_detail?.paypal == "true" ||
                route?.params?.listing_user_detail?.bank == "true") && (
                <TouchableOpacity
                  style={styles1.btn}
                  onPress={() => handlePress(0)}
                >
                  <Text style={styles1.btnText}>
                    {TranslationStrings.CREDIT_CARD}
                  </Text>
                  {selected_index == 0 && (
                    <View style={styles1.checkedView}>
                      <Checkbox status={"checked"} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              {route?.params?.listing_user_detail?.bitcoin == "true" && (
                <TouchableOpacity
                  style={styles1.btn}
                  onPress={() => handlePress(1)}
                >
                  <Text style={styles1.btnText}>
                    {TranslationStrings.BIT_COIN}
                  </Text>
                  {selected_index == 1 && (
                    <View style={styles1.checkedView}>
                      <Checkbox status={"checked"} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity style={styles1.btn} onPress={() => handlePress(2)}>
            <Text style={styles1.btnText}>
              {TranslationStrings.PAY_ON_DELIVERY}
            </Text>
            {selected_index == 2 && (
              <View style={styles1.checkedView}>
                <Checkbox status={"checked"} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles1.btn} onPress={() => handlePress(3)}>
            <Text style={styles1.btnText}>
              {TranslationStrings.PAY_ON_PICKUP}
            </Text>
            {selected_index == 3 && (
              <View style={styles1.checkedView}>
                <Checkbox status={"checked"} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentOptions;
const styles1 = StyleSheet.create({
  btn: {
    height: hp(15),
    width: wp(90),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.Appthemecolor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "#000",
    fontSize: 18,
  },
  checkedView: { position: "absolute", top: hp(15) / 3, left: 0 },
});
