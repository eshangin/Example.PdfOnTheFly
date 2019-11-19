<template>
  <router-view id="app" class="d-flex flex-column"></router-view>
</template>

<script>
  import 'bootstrap'
  export default {
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap');
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";

    html {
        font-size: 12px;
        line-height: 19px;
    }
  $theme-colors: (
    primary: #15a4fa,
    danger: #ff5a5f
  );

  @import "~bootstrap/scss/bootstrap";

  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css');

  * {
    box-sizing: border-box!important;
  }
    $color-dark: #2b3a65;

    #app {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
  html, body, #app {
    height: 100%;
  }
  .navbar-brand {
    font-size: 20px;
  }
  h1, .h1 {
    font-size: 20px!important;
    line-height: 30px;
  }
  h2, .h2, .title2 {
    font-size: 16px!important;
    line-height: 24px;
  }
  hr {
      border-top-width: 2px;
  }
  .table {
    th, td {
      text-align: center;
    }
    th {
      color: #8f8f8f;
      text-transform: uppercase;
      font-weight: normal;
      border-top: 0;
      border-bottom: 2px solid $color-dark !important;
      font-size: 12px;
    }
    td {
      border-top: 0;
      border-bottom: 1px solid #dadfea;
      font-size: 14px;
    }
  }
  .btn {
    font-size: 14px;
    line-height: 17px;
    padding: .875rem .75rem;
    box-shadow: none !important;

    &.btn-sm {
      font-size: 12px;
      line-height: 15px;
      padding: .729rem .529rem;
    }

    &.btn-wide {
        padding-left: 50px;
        padding-right: 50px;
    }
    &.btn-wide-sm {
        padding-left: 30px;
        padding-right: 30px;
    }
    &.btn-secondary {
        background-color: #fff;
        color: #8c97b2;
        border-color: #8c97b2;
        &:hover {
            background-color: #8c97b2;
            color: #fff;
        }
    }
  }

.input-group {
  .form-control {
    border-left-color: transparent;
  }
  .input-group-text {
    border-right-color: transparent;
    background-color: #fff;
  }
}

.border {
  border-color: #ced4da !important
}

  .regular-text {
      font-size: 12px;
      line-height: 19px;
  }
  .large-text {
      font-size: 14px;
      line-height: 17px;
  }
  small, .small-text {
      font-size: 10px;
      line-height: 16px;
  }

    .form-control {
        font-size: 14px;
        line-height: 17px;
        height: calc(2em + 0.75rem + 3px);
        box-shadow: none !important;
        background-color: #fff !important;        

        &:hover {
            border-color: #97b3ce;
        }
        &:focus {
            border: solid 1px #2b3a65;
            box-shadow: 0 0 0 1px #2b3a65 !important;
        }
        &.is-invalid {
            background-image: none;
            border-color: #ff5a5f; 
            border-width: 1px;
            box-shadow: 0 0 0 1px #ff5a5f !important;
        }
    }

    textarea.form-control {
      padding: .675rem .75rem
    }

    .invalid-feedback {
        margin-left: 16px;
    }

    .custom-checkbox .custom-control-label::before {
      border-radius: 0;
      box-shadow: none !important;
    }

.promise-btn__spinner-wrapper {
    white-space: nowrap;
    &.hidden {
        display: none
    }
}

.section-title {
    padding: 26px 0 18px; 
    border-bottom: 2px solid #2b3a65;
    margin: 0;
}
.page-title {
    height: 80px;
    background-color: #eef1f7;
}

.no-gutters {
  margin-right: 0;
  margin-left: 0;

  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}

</style>

