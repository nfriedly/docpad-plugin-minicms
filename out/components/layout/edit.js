// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };



  module.exports = function() {
    var error, success, _i, _j, _len, _len1, _ref, _ref1;
    coffeescript(function() {
      var updateFormLayout;
      window.minicms_form_init = function(prefix, form) {
        var data;
        data = $('#' + form + '-form').data('fields');
        $('#minicms .well').css('display', 'block');
        $('#minicms #' + form + '-form-save-button').on('click', function(e) {
          e.preventDefault();
          if ($('#minicms #' + form + '-form-save-button').hasClass('disabled')) {
            return;
          }
          $('#minicms #' + form + '-form-save-button').addClass('disabled');
          return minicms_form_save(prefix, form);
        });
        $('#minicms #' + form + '-form-confirm-delete-button').on('click', function(e) {
          e.preventDefault();
          if ($('#minicms #' + form + '-form-confirm-delete-button').hasClass('disabled')) {
            return;
          }
          $('#minicms #' + form + '-form-confirm-delete-button').addClass('disabled');
          return minicms_form_delete(prefix, form);
        });
        return console.log(data);
      };
      window.minicms_form_load = function(prefix, form, field) {
        var allLoaded, data, loaded, name, val;
        data = $('#' + form + '-form').data('fields');
        loaded = $('#' + form + '-form').data('loaded');
        allLoaded = $('#' + form + '-form').data('all-loaded');
        if (allLoaded) {
          return;
        }
        if (loaded == null) {
          loaded = {};
        }
        loaded[field] = true;
        allLoaded = true;
        for (name in data) {
          val = data[name];
          if (!loaded[name]) {
            console.log("NOT LOADED: " + name);
            allLoaded = false;
            break;
          }
        }
        $('#' + form + '-form').data('loaded', loaded);
        if (allLoaded) {
          $('#' + form + '-form').data('all-loaded', allLoaded);
          return minicms_form_update(prefix, form);
        }
      };
      window.minicms_form_update = function(prefix, form) {
        var allLoaded, changed, data, deps, field, k, key, keys, name, newVal, toReload, v, val, xhr, _i, _len, _ref;
        allLoaded = $('#' + form + '-form').data('all-loaded');
        if (!allLoaded) {
          return;
        }
        data = {};
        _ref = $('#' + form + '-form').data('fields');
        for (name in _ref) {
          val = _ref[name];
          data[name] = val;
        }
        keys = $('#' + form + '-form').data('keys');
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (data[key] == null) {
            data[key] = null;
          }
        }
        deps = $('#' + form + '-form').data('deps');
        toReload = [];
        changed = false;
        for (name in data) {
          val = data[name];
          field = $('#field-' + form + '-' + name);
          newVal = field.data('value');
          if (newVal == null) {
            newVal = null;
          }
          if (val == null) {
            val = null;
          }
          if (!_.isEqual(val, newVal)) {
            changed = true;
            console.log(name + " changed");
            data[name] = newVal;
            for (k in deps) {
              v = deps[k];
              if (__indexOf.call(v, name) >= 0) {
                console.log("should reload " + k);
                if (__indexOf.call(toReload, k) < 0) {
                  toReload.push(k);
                }
              }
            }
          }
        }
        if (changed) {
          $('#' + form + '-form-save-button').css('display', 'inline-block');
        }
        $('#' + form + '-form').data('fields', data);
        if (toReload.length > 0) {
          console.log("update data...");
          return xhr = $.ajax({
            url: document.location.href,
            type: 'POST',
            data: {
              fields: JSON.stringify(data)
            }
          }).done(function() {
            var bodyContents, bodyMatcher, el, headMatcher, html, reload, subname, _j, _len1, _results;
            html = xhr.responseText;
            html = html.split("\n").join(' ').split("\r").join(' ');
            html = html.replace(/<script([^>]*)>(.*?)<\/script>/ig, '');
            bodyMatcher = /<body([^>]*)>(.*)<\/body>/ig;
            bodyMatcher.lastIndex = 0;
            headMatcher = /<head([^>]*)>(.*)<\/head>/ig;
            headMatcher.lastIndex = 0;
            bodyContents = html.match(bodyMatcher)[0].replace(/^<body([^>]*)>/ig, '').replace(/<\/body>$/ig, '');
            el = $(bodyContents);
            _results = [];
            for (_j = 0, _len1 = toReload.length; _j < _len1; _j++) {
              subname = toReload[_j];
              $('#field-' + form + '-' + subname + ' .form-field-content').replaceWith($('#field-' + form + '-' + subname + ' .form-field-content', el));
              reload = $('#field-' + form + '-' + subname).data('reload');
              console.log(reload);
              if (reload != null) {
                _results.push(eval(reload));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }).fail(function() {
            return console.log("fail");
          });
        }
      };
      window.minicms_form_save = function(prefix, form) {
        var data, formEl, key, keys, name, val, _i, _len, _ref;
        data = {};
        _ref = $('#' + form + '-form').data('fields');
        for (name in _ref) {
          val = _ref[name];
          data[name] = val;
        }
        keys = $('#' + form + '-form').data('keys');
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (data[key] == null) {
            data[key] = null;
          }
        }
        formEl = $('<form method="post"><input class="input-fields" type="hidden" name="fields" /><input type="hidden" name="do" value="save" /></form>');
        formEl.attr('action', document.location.href);
        $('input.input-fields', formEl).val(JSON.stringify(data));
        return formEl[0].submit();
      };
      window.minicms_form_delete = function(prefix, form) {
        var formEl;
        formEl = $('<form method="post"><input type="hidden" name="do" value="delete" /></form>');
        formEl.attr('action', document.location.href);
        return formEl[0].submit();
      };
      updateFormLayout = function() {
        if ($(window).width() < 1180) {
          $('.main-edit-form').removeClass('form-horizontal');
          return $('.main-edit-form').addClass('form-not-horizontal');
        } else {
          $('.main-edit-form').addClass('form-horizontal');
          return $('.main-edit-form').removeClass('form-not-horizontal');
        }
      };
      $(document).ready(function() {
        return updateFormLayout();
      });
      return $(window).on('resize', function() {
        return updateFormLayout();
      });
    });
    if (this.item != null) {
      h2(function() {
        return 'Edit ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1));
      });
    } else {
      h2(function() {
        return 'Create ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1));
      });
    }
    if (this.item != null) {
      div('#' + this.form + '-form-confirm-delete.modal.hide.fade', {
        tabindex: '-1',
        role: 'dialog',
        'aria-hidden': 'true'
      }, function() {
        div('.modal-header', function() {
          return h4(function() {
            return 'Delete ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1)) + '?';
          });
        });
        div('.modal-body', function() {
          return p(function() {
            return 'Doing this will erase permanently all data related to this content. It cannot be undone.';
          });
        });
        return div('.modal-footer', function() {
          button('.btn', {
            'data-dismiss': 'modal',
            'aria-hidden': 'true'
          }, function() {
            return 'Cancel';
          });
          return button('#' + this.form + '-form-confirm-delete-button.btn.btn-danger', function() {
            return 'Delete ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1));
          });
        });
      });
    }
    div('.well', {
      style: 'display:none'
    }, function() {
      if (!this.model.unique) {
        a('#' + this.form + '-form-list-button.btn.btn-primary.btn-small.form-delete-button', {
          href: '/' + this.config.prefix.url + '/' + this.slugify(this.model.name[0]) + '/list'
        }, function() {
          span('.icon-arrow-left.icon-white', function() {});
          return text(' ' + h(this.model.name[1]));
        });
        text(' &nbsp; ');
      }
      if (this.item != null) {
        if (!this.model.unique) {
          a('#' + this.form + '-form-delete-button.btn.btn-danger.btn-small.form-delete-button', {
            href: '#' + this.form + '-form-confirm-delete',
            'data-toggle': 'modal'
          }, function() {
            span('.icon-trash.icon-white', function() {});
            return text(' Delete ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1)));
          });
          text(' &nbsp; ');
        }
        return a('#' + this.form + '-form-save-button.btn.btn-success.btn-small.form-save-button', {
          href: '/' + this.config.prefix.url + '/' + this.slugify(this.model.name[0]) + '/edit?url=' + this.item.url
        }, function() {
          span('.icon-download-alt.icon-white', function() {});
          return text(' Save ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1)));
        });
      } else {
        return a('#' + this.form + '-form-save-button.btn.btn-success.btn-small.form-save-button', {
          href: '/' + this.config.prefix.url + '/' + this.slugify(this.model.name[0]) + '/edit'
        }, function() {
          span('.icon-download-alt.icon-white', function() {});
          return text(' Save ' + h(this.model.name[0].charAt(0).toLowerCase() + this.model.name[0].substring(1)));
        });
      }
    });
    _ref = this.errors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      error = _ref[_i];
      div('.alert.alert-error', function() {
        a('.close', {
          'data-dismiss': 'alert',
          'data-field': (error.field != null ? h(error.field) : '')
        }, function() {
          return '×';
        });
        return text(' ' + h(error.message));
      });
    }
    _ref1 = this.successes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      success = _ref1[_j];
      div('.alert.alert-success', function() {
        a('.close', {
          'data-dismiss': 'alert'
        }, function() {
          return '×';
        });
        return text(' ' + h(success.message));
      });
    }
    div('.well', {
      style: 'display:none'
    }, function() {
      return form('#' + this.form + '-form.form-horizontal.main-edit-form', {
        'data-model': this.slugify(this.model.name[0]),
        'data-fields': h(JSON.stringify(this.data)),
        'data-deps': h(JSON.stringify(this.deps)),
        'data-keys': h(JSON.stringify(this.keys)),
        onsubmit: 'return false;'
      }, function() {
        var component, _k, _len2, _ref2, _results;
        _ref2 = this.components;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          component = _ref2[_k];
          _results.push(text(component));
        }
        return _results;
      });
    });
    return text('<script type="text/javascript">minicms_form_init("' + this.config.prefix.url + '", "' + this.form + '");</script>');
  };

}).call(this);
