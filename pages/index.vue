<template>
  <div>
    <mt-navbar :barGradientBackground="['#7167D5', '#53A0FD']" avatarURL="https://cdn.wallpapersafari.com/50/66/aqhjeR.png"/>

    <mt-dual-panel :centerContent="true">
      <div class="px-35" style="width: 100%">
        <mt-input class="my-15 px-35" 
          label="电子邮件"
          hint="请输入的电子邮件地址"
          type="email"
          :required="true"
          :persistentHint="false"
          :counterLimit="35"
          :rules="emailRules"
          rulesErrorMessage="邮件格式不正确"
          :validationCheckIcon="true"
          :validationOnBlur="true"/>

        <mt-input class="my-15 px-35"
          label="密码"
          hint="请输入的账户密码"
          type="password"
          :required="true"
          :persistentHint="false"
          :counterLimit="35"
          :validationCheckIcon="true"
          :validationOnBlur="true"/>
        
        <mt-textarea class="my-15 px-35"
          label="内容"
          hint="请输入的账户密码"
          :required="true"
          :persistentHint="false"
          :counterLimit="35"/>

        <mt-select class="my-15 px-35"
          label="州"
          hint="请从下拉菜单里选择一项"
          :items="['aasda', 'asd', 'asdasdd', 'asdasd']"
          :required="true"
          :validationCheckIcon="true"
          :persistentHint="true"/>

        <div class="my-15 px-35">
          <mt-button class="mw-100"
            label="确认"
            rippleColor="white"
            textColor="white"
            :gradientBackground="['#7167D5', '#53A0FD']"
            :roundness="5"/>
        </div>

        <div class="my-15 px-35">
          <mt-button class="mw-100"
            label="米团账号登录"
            rippleColor="white"
            textColor="#7167D5"
            background="white"
            :gradientBorder="['#7167D5', '#53A0FD']"
            :roundness="5"/>
        </div>

        <div class="my-15 px-35">
          <mt-button class="mw-100"
            label="Google 登录"
            rippleColor="white"
            textColor="white"
            background="#DF4B37"
            icon="fab fa-google"
            :roundness="5"/>
        </div>

        <div class="my-15 px-35">
          <mt-button class="mw-100"
            label="Facebook 登录"
            rippleColor="white"
            textColor="white"
            background="#3A579E"
            icon="fab fa-facebook-f"
            :roundness="5"/>
        </div>

        <div class="my-15 px-35">
          <mt-calender />
        </div>

      </div>
    </mt-dual-panel>
    

  </div>
  
</template>

<script>

export default {
  data () {
    return {
      resetError: false
    }
  },

  computed: {
    emailRules () {
      return [
        content => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(content)
        }
      ]
    }
  },

  methods: {
    resetInput (vm) {
      console.log(vm)
      vm.resetInput()
    }
  }
}
</script>

<style>
.mw-100 {
  width: 100%;
}
</style>

