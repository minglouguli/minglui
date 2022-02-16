import mlNav from './ml-nav.vue';
class MLNav {
  install = Vue => {
    Vue.component(mlNav.name, mlNav);

    Vue.mixin({
      beforeCreate() {
        if (this.$options.name == 'ml-nav') {
          this._navRoot = this;
          this._nav = this; // this.$options.nav(); // this;
        } else {
          this._navRoot = (this.$parent && this.$parent._navRoot) || this;
        }

        //通过特性传值，而不是props，这个时候this 非后面的实例；
        if (this.$attrs && this.$attrs._navItem) {
          this._navItemRoot = this;
          this._navItem = this.$attrs._navItem;
        } else {
          this._navItemRoot =
            (this.$parent && this.$parent._navItemRoot) || this;
        }
      }
      // data() {
      //   if (this.$options.name == 'order-list') {
      //     console.log('data2');
      //   }
      //   if (this._props && this._props._navItem) {
      //     this._navItemRoot = this;
      //     this._navItem = this._props._navItem;
      //   } else {
      //     this._navItemRoot =
      //       (this.$parent && this.$parent._navItemRoot) || this;
      //   }
      //   return {};
      // },
      // created() {

      // },
    });
    Object.defineProperty(Vue.prototype, '$nav', {
      get() {
        let _ = this;
        let _nav = this._navRoot._nav;
        return {
          open(d) {
            d.$parent = _;
            _nav.open(d);
          },
          close(i) {
            _nav.close(i);
          }
        };
      }
    });

    Object.defineProperty(Vue.prototype, '$navItem', {
      get() {
        return this._navItemRoot._navItem;
      }
    });
  };
}

export default new MLNav();
