// Service handler
window.A5.ServiceHandleUtility = {
    firebaseFixupData : function(data) {
        if(Object.prototype.toString.call(data) === '[object Array]') {
            for( var i = 0 ; i < data.length ; ++i ) {
                data[i] = A5.ServiceHandleUtility.firebaseFixupData( data[i] );
            }
        } else if( typeof data == 'object' ) {
            for (var key in data) {
                var item = data[key];
                if( typeof item == 'object' ) {
                    data[key] = A5.ServiceHandleUtility.firebaseFixupData(item);
                }
            }
            if( data && data['seconds'] && !data['_seconds'] ) {
                data['_seconds'] = data['seconds'];
            }
            if( data && data['nanoseconds'] && !data['_nanoseconds'] ) {
                data['_nanoseconds'] = data['nanoseconds'];
            }
        }
        return data;
    }
};
window.A5.ServiceHandler = Class.create({
	initialize: function(_def) {
        var loadJS = function(url, implementationCode, location){
            var scriptTag = document.createElement('script');
            scriptTag.src = url;
            scriptTag.onload = implementationCode;
            scriptTag.onreadystatechange = implementationCode;
            location.appendChild(scriptTag);
        };

        this.def = _def;
        if( this.def.firebase ) {
            var fb = this.def.firebase;

            fb.onAfterLoad = [];
            fb.afterLoaded = function() {
                return new Promise((resolve, reject) => {
                    if( fb.loaded ) {
                        resolve();
                    } else {
                        fb.onAfterLoad.push(resolve);
                    }
                });
            };
            var firebaseInit = function(def) {
                if (typeof firebase !== 'undefined') {
                    var obj = def.firebase;
                    var fbInst = firebase;
                    if( obj.config && obj.config.projectId ) {
                        if( !window.firebaseAppsInitialized ) {
                            window.firebaseAppsInitialized = {};
                        }
                        if( !window.firebaseAppsInitialized[obj.config.projectId] ) {
                            window.firebaseAppsInitialized[obj.config.projectId] = true;
                            firebase.initializeApp(obj.config,obj.config.projectId);
                        }
                        fbInst = firebase.app(obj.config.projectId);
                    } else {
                        fbInst.initializeApp(obj.config);
                    }

                    // make auth and firestore references

                    obj.auth = fbInst.auth();
                    if( def.firebase.useEmulator ) {
                        obj.auth.useEmulator("http://localhost:9099/");
                    }
                    obj.db = fbInst.firestore();
                    if( def.firebase.useEmulator ) {
                        obj.db.useEmulator("localhost",8080)
                    }



/////////////////////

                    if(def.firebase.enablePersistence) {
                        // enable offline data / data sync
                        obj.db.enablePersistence()
                        .catch(function(err) {
                        if (err.code == 'failed-precondition') {
                            // probably multiple tabs open at once
                            console.log('persistance failed');
                        } else if (err.code == 'unimplemented') {
                            // lack of browser support for the feature
                            console.log('persistance not available');
                        }
                        });
                    }


                    fb.loaded = true;
                    for( var i = 0 ; i < fb.onAfterLoad.length ; ++i ) {
                        fb.onAfterLoad[i]();
                    }
                    fb.onAfterLoad = [];
                    //window.functions = fbInst.functions();
                    //alert(24);
                    //debugger;
                    if( obj.onAuthStateChanged ) {
                        obj.auth.onAuthStateChanged(user => {
                            obj.user = user;
                            if(!obj.auth.currentUser) {
								var e = {};
								e.isLoggedIn = false;
								e.userObject = false;
								e.uid = false;
								e.email = false;
								e.refreshToken = false;
								e.accessToken = false;
							}
                            if( obj.auth.currentUser ) {
								//alert(37);
								var e = {};
								e.userObject = obj.auth.currentUser
								e.isLoggedIn = true;
								e.uid = obj.auth.currentUser.uid
								e.email = obj.auth.currentUser.email
								e.refreshToken = obj.auth.currentUser.refreshToken;
								//debugger;
								e.accessToken = e.userObject.toJSON().stsTokenManager.accessToken
								//token = obj.auth.currentUser.getStsTokenManager().accessToken
                                obj.auth.currentUser.getIdTokenResult().then(
                                    tok => obj.onAuthStateChanged(e,tok.token)
                                ).catch( err => obj.onAuthStateChanged(obj,null) );
                            } else {
                                //obj.onAuthStateChanged(obj,null);
                                obj.onAuthStateChanged(e,null);
                            }
                        });
                    }
                    return true;
                }
                return false;
            }
            var firebaseRetry = function() {
                if(  !firebaseInit(_def) ) {
                   setTimeout(firebaseRetry,500);
                }
            }
            if (typeof firebase === 'undefined') {
                loadJS("__a5_system/googleapis/firebase-app.js", (e) => {
                    loadJS("__a5_system/googleapis/firebase-auth.js", (e) => {
                        loadJS("__a5_system/googleapis/firebase-firestore.js", (e) => {
                            loadJS("__a5_system/googleapis/firebase-functions.js", (e) => {
                                 firebaseRetry();
                            }, document.body);
                        }, document.body);
                    }, document.body);
                } , document.body);
            } else {
                firebaseRetry();
            }
        }
    },
    recordGetPromise : function(_arguments) {
        if( _arguments.collectionName && _arguments.key) {
            if( this.def.firebase ) {
                var obj = this.def.firebase;
                return new Promise((resolve, reject) => {
                    obj.afterLoaded().then( function() {
                        obj.db.collection(_arguments.collectionName).doc(_arguments.key).get().then(doc => {
                            const rec = doc.data() || {};
                            rec = A5.ServiceHandleUtility.firebaseFixupData(rec);
                            resolve(rec);
                        }).catch(err => reject(err.message));
                    });
                });
            }
            return new Promise((resolve, reject) => {
                reject("Service not initialized");
            });
        }
        return new Promise((resolve, reject) => {
            reject("Missing parameters");
        });
    },
    recordSetPromise: function(_arguments) {
        if( !_arguments.key ) {
            _arguments.key = A5.UUID();
        }
        if( _arguments.collectionName && _arguments.data ) {
            var obj = this.def.firebase;
            return new Promise((resolve, reject) => {
                obj.afterLoaded().then( function() {
                    var doc = obj.db.collection(_arguments.collectionName).doc(_arguments.key);
                    if( _arguments.merge ) {
                        doc.get().then( function(rec) {
                            var existRec =  rec.data() || {};
                            var recData = JSON.parse(JSON.stringify(existRec));
                            for (const property in _arguments.data) {
                                recData[property] = _arguments.data[property];
                            }
                            doc.set(recData).then(()=>{
                                resolve();
                            }).catch(err=>reject(err.message));
                        } ).catch(err=>reject(err.message));
                    } else {
                        doc.set(_arguments.data).then(()=>{
                            resolve();
                        }).catch(err=>reject(err.message));
                    }
                });
            });
        }
        return new Promise((resolve, reject) => {
            reject("Missing parameters");
        });
    },
    recordDeletePromise: function(_arguments) {
        if( _arguments.collectionName && _arguments.key) {
            if( this.def.firebase ) {
                var obj = this.def.firebase;
                return new Promise((resolve, reject) => {
                    obj.afterLoaded().then( function() {
                        obj.db.collection(_arguments.collectionName).doc(_arguments.key).get().then(doc => {
                            if( doc && doc.ref ) {
                                doc.ref.delete();
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }).catch(err => reject(err.message));
                    });
                });
            }
            return new Promise((resolve, reject) => {
                reject("Service not initialized");
            });
        }
        return new Promise((resolve, reject) => {
            reject("Missing parameters");
        });
    },
    bulkImportPromise : function(_arguments) {
        if( _arguments.collectionName && _arguments.data ) {
            var obj = this.def.firebase;
            var items = null;
            if( _arguments.data ) {
                items = _arguments.data;
                if( Array.isArray(items ) ) {
                    if( items.length > 0 ) {
                        return new Promise((resolve, reject) => {
                            obj.afterLoaded().then( function() {
                                var collection = obj.db.collection(_arguments.collectionName);
                                var nTransaction = items.length;
                                var endTrans = function(err,rowIndex) {
                                    --nTransaction;
                                    if( nTransaction < 1 ) {
                                        resolve(true);
                                    }
                                };
                                for( var i = 0 ; i < items.length ; ++i ) {
                                    (function(row,rowIndex) {
                                        var key = null;
                                        if( _arguments.idPropertyName ) {
                                            key = row[_arguments.idPropertyName];
                                        }
                                        if( !key ) {
                                            key = A5.UUID();
                                        }
                                        collection.doc(""+key).set(row).then(function(){
                                            endTrans(null);
                                        }).catch(err => endTrans(err.message));
                                    })(items[i],i);
                                }
                            });
                        });
                    } else {
                        return new Promise((resolve, reject) => {
                            resolve(true);
                        });
                    }
                }
            }
        }
        return new Promise((resolve, reject) => {
            reject("Missing parameters");
        });
    },
    synchronizePromise : function(_arguments) {
        if( this.def.firebase ) {
            var obj = this.def.firebase;
            return new Promise((resolve, reject) => {
                obj.afterLoaded().then( function() {
                    var collection = obj.db.collection(_arguments.collectionName);
                    var items = null;
                    if( _arguments.list ) {
                        items = _arguments.list._data;
                    } else if( _arguments.data ) {
                        items = _arguments.data;
                    }
                    if( items ) {
                        if( Array.isArray(items ) ) {
                            var nTransaction = 0;
                            var deletedRecs = [];
                            var removeTrans = [];
                            var endTrans = function(err,rowIndex) {
                                --nTransaction;
                                if( err ) {
                                    if( _arguments.list ) {
                                        if( items[rowIndex]._isDeleted )
                                            _arguments.list._setGlobalCRUDErrors([rowIndex],err,'delete');
                                        else
                                            _arguments.list._setGlobalCRUDErrors([rowIndex],err,'update');
                                    }
                                } else if( _arguments.list ) {
                                    if( items[rowIndex]._isDeleted && items[rowIndex].__key__ ) {
                                        items[rowIndex]["*value"] = items[rowIndex].__key__;
                                        deletedRecs.push(  items[rowIndex].__key__ );
                                    } else {
                                        _arguments.list.setRowClean([rowIndex]);
                                    }
                                }
                                if( nTransaction == 0 ) {
                                    var removals = removeTrans.length;
                                    while(removals > 0) {
                                        --removals;
                                        removeTrans[removals].delete();
                                    }
                                    resolve(true);
                                    for( var i = 0 ; i < deletedRecs.length ; ++i ) {
                                        _arguments.list.removeRowFromListByKey(deletedRecs[i]);
                                    }
                                }
                            };
                            // Count the # of transactions we are expecting
                            for( var i = 0 ; i < items.length ; ++i ) {
                                var row = items[i];
                                if( row._isDirty ) {
                                    if( row.__key__ ) {
                                        ++nTransaction;
                                    } else if( _arguments.keyField ) {
                                        if( row[_arguments.keyField] ) {
                                            // JIT assignment
                                            row.__key__ = row[_arguments.keyField];
                                            ++nTransaction;
                                        }
                                    }
                                }
                            }
                            if( nTransaction > 0 ) {
                                // Apply all the transactions..
                                for( var i = 0 ; i < items.length ; ++i ) {
                                    (function(row,rowIndex) {
                                        if( row._isDirty && row.__key__ ) {
                                            if( row._isDeleted ) {
                                                collection.doc(row.__key__).get().then(doc => {
                                                    removeTrans.push(doc.ref);
                                                    endTrans(null,rowIndex);
                                                }).catch(err => endTrans(err.message,rowIndex));
                                            } else {
                                                var recData = {};
                                                for (const property in row) {
                                                    if( property != '__key__'
                                                     && property != '_isDirty'
                                                     && property != '_isDeleted'
                                                     && property != '_isNewRow'
                                                     && property != '__displayStyle'
                                                     && property != '_oldData'
                                                     && property != '*key'
                                                     && property != '*renderIndex'
                                                     && property != '*rowGUID'
                                                     && property != '*value'
                                                     && property != '_isDirty'
                                                     && property != '_isDeleted'
                                                     && property != '_isNewRow'
                                                     && property != '__displayStyle'
                                                     && property != '_oldData'
                                                     && property != '*key'
                                                     && property != '*renderIndex'
                                                     && property != '*rowGUID'
                                                     && property != '*value'
                                                     && property != '_flagServerSideErrorInChild'
													 && property != '__edit'
													 && property != '_hasGlobalErrors'
													 && property != '_writeConflictErrors'
													 && property != '_flagWriteConflictErrorInChild'
													 && property != '_hasServerSideError'
													 && property != '_hasWriteConflictErrors'
													 && property != '_serverSideErrors'
													 && property != '_hasUnsyncedMediaFiles'
													 && property != '_flagGlobalErrorInChild'
  													 && property != '_dirtyImages'

                                                     ) {
                                                        if(typeof row[property] != 'undefined') recData[property] = row[property];
                                                    }
                                                }
                                                collection.doc(row.__key__).set(recData).then(function() {
                                                    endTrans(null,rowIndex);
                                                }).catch(err => endTrans(err.message,rowIndex));
                                            }
                                        }
                                    })(items[i],i);
                                }
                            } else {
                                // nothing to do...
                                resolve(true);
                            }
                        }
                    }
                });
            });
        }
        return new Promise((resolve, reject) => {
            reject("Service not initialized");
        });
    },
    __queryCreateLow: function(obj,_arguments) {
        var query = obj.db.collection(_arguments.collectionName);
        if( _arguments.orderBy ) {
            if( Array.isArray(_arguments.orderBy ) ) {
                for(var oi = 0 ; oi < _arguments.orderBy.length ; ++oi ) {
                    query = query.orderBy(_arguments.orderBy[oi]);
                }
            } else {
                query = query.orderBy(_arguments.orderBy);
            }
        }
        if( _arguments.startAt ) {
            if( Array.isArray(_arguments.startAt ) ) {
                query = query.startAt(..._arguments.startAt);
            } else {
                query = query.startAt(_arguments.startAt);
            }
        }
        if( _arguments.limit ) {
            if( _arguments.offset && _arguments.offset > 0 ) {
                query = query.limit(_arguments.limit + _arguments.offset);
            } else {
                query = query.limit(_arguments.limit);
            }
        }
        if( _arguments.where ) {
            if( Array.isArray(_arguments.where) ) {
                if( Array.isArray(_arguments.where[0]) ) {
                    for(var wi = 0 ; wi < _arguments.where.length ; ++wi ) {
                        var wherePtr = _arguments.where[wi];
                        if( Array.isArray(wherePtr) ) {
                            if( wherePtr.length == 3 ) {
                                query = query.where(wherePtr[0], wherePtr[1], wherePtr[2]);
                            }
                        }
                    }
                } else if( _arguments.where.length > 0 && typeof _arguments.where[0] === 'object' && _arguments.where[0] !== null ) {
                    for(var wi = 0 ; wi < _arguments.where.length ; ++wi ) {
                        var wherePtr = _arguments.where[wi];
                        if( typeof wherePtr === 'object' && wherePtr !== null ) {
                            if( wherePtr.field && wherePtr.operator && wherePtr.value  ) {
                                query = query.where(wherePtr.field, wherePtr.operator, wherePtr.value);
                            }
                        }
                    }
                } else if( _arguments.where.length == 3 ) {
                    query = query.where(_arguments.where[0], _arguments.where[1], _arguments.where[2]);
                }
            } else if( typeof _arguments.where === 'object' && _arguments.where !== null ) {
                if( _arguments.where.field && _arguments.where.operator && _arguments.where.value  ) {
                    query = query.where(_arguments.where.field, _arguments.where.operator, _arguments.where.value);
                }
            }
        }
        return query;
    },

    __queryListLow: function(snapshot,_arguments) {
        var listData = [];

		var _JSONSafeStringify =  function(obj) {
			var result = {};
			try{
				result = JSON.stringify(obj)
				return result;
			}catch(e) {
				for(n in obj) {
					if(typeof obj[n] != 'object' || obj[n] == null) {
						result[n] = obj[n];
					} else {
						//debugger;
					}

				}

				result = JSON.stringify(result);
				return result;
			}
		}
        var offset = 0;
        if( _arguments.offset && _arguments.offset > 0 ) {
            offset = _arguments.offset;
        }
        if( _arguments.keyAndData ) {
            if( offset > 0 ) {
                snapshot.docs.forEach(doc => {
                    if( offset > 0 ) {
                        --offset;
                    } else {
                        var data = JSON.parse(_JSONSafeStringify(doc.data()));
                        data["__key__"] = doc.id
                        data = A5.ServiceHandleUtility.firebaseFixupData(data);
                        listData.push( data );
                    }
                });
            } else {
                snapshot.docs.forEach(doc => {
					try{
						var _d = doc.data();

						var _ds = _JSONSafeStringify(_d);
						var data = JSON.parse(_ds);
						data["__key__"] = doc.id
						data = A5.ServiceHandleUtility.firebaseFixupData(data);
						listData.push( data );
					}catch(e) {

					};

                });
            }
        } else if( _arguments.keyOnly ) {
            if( offset > 0 ) {
                snapshot.docs.forEach(doc => {
                    if( offset > 0 ) {
                        --offset;
                    } else {
                        listData.push( doc.id );
                    }
                });
            } else {
                snapshot.docs.forEach(doc => {
                    listData.push( doc.id );
                });
            }
        } else {
            if( offset > 0 ) {
                snapshot.docs.forEach(doc => {
                    if( offset > 0 ) {
                        --offset;
                    } else {
                        listData.push( A5.ServiceHandleUtility.firebaseFixupData(doc.data()) );
                    }
                });
            } else {
                snapshot.docs.forEach(doc => {
                    listData.push( A5.ServiceHandleUtility.firebaseFixupData(doc.data()) );
                });
            }
        }
        return listData;
    },
    queryPromise : function(_arguments) {
        if( this.def.firebase ) {
            var self = this;
            var obj = this.def.firebase;
            return new Promise((resolve, reject) => {
                obj.afterLoaded().then( function() {
                    var query = self.__queryCreateLow(obj,_arguments);
                    query.get().then( function(snapshot) {
                        resolve(self.__queryListLow(snapshot,_arguments));
                    },err => reject(err.message));
                });
            });
        }
        return new Promise((resolve, reject) => {
            reject("Service not initialized");
        });
    },
    snapShotPromise : function(_arguments) {
        if( this.def.firebase ) {
            var self = this;
            var obj = this.def.firebase;
            var initialHandled = false;
            return new Promise((resolve, reject) => {
                obj.afterLoaded().then( function() {
                    var query = self.__queryCreateLow(obj,_arguments);
                    query.onSnapshot( function(snapshot) {
                        var data = self.__queryListLow(snapshot,_arguments);
                        if( _arguments.populate ) {
                            _arguments.populate(data);
                        }
                        if( !initialHandled ) {
                            initialHandled = true;
                            resolve(data);
                        }
                    },function(err) {
                        if( _arguments.error ) {
                            _arguments.error(err.message);
                        }
                        if( !initialHandled ) {
                            initialHandled = true;
                            reject(err.message);
                        }
                    });
                });
            });
        }
        return new Promise((resolve, reject) => {
            reject("Service not initialized");
        });
    },
    userIdGet: function() {
        var _def = this.def;
        if( _def.firebase ) {
            return _def.firebase.uid;
        }
        return null;
    },
    loginPromise : function(options) {
        var _def = this.def;
        if( _def.firebase ) {
            var fb = _def.firebase;
            var providerName = null;
            if( options.provider ) {
                providerName = options.provider.toLowerCase();
                if( providerName != 'google' && providerName != 'facebook' && providerName != 'twitter' && providerName != 'github' ) {
                    providerName = null;
                }
            }
            if( providerName ) {
                return new Promise((resolve, reject) => {
                    fb.afterLoaded().then( function() {
                        var provider = null;
                        if( providerName == 'google' ) {
                            provider = new firebase.auth.GoogleAuthProvider();
                        } else if( providerName == 'facebook' ) {
                            provider = new firebase.auth.FacebookAuthProvider();
                        } else if( providerName == 'twitter' ) {
                            provider = new firebase.auth.TwitterAuthProvider();
                        } else if( providerName == 'github' ) {
                            provider = new firebase.auth.GithubAuthProvider();
                        }
                        fb.auth.signInWithPopup(provider).then((result) => {
                            /** @type {firebase.auth.OAuthCredential} */
                            // The signed-in user info.
                            fb.uid = result.user.uid;
                            resolve(fb.uid,_def);
                            // ...
                        }).catch(err => reject(err.message));
                    });
                });
            } else if( options.email && options.password ) {
                return new Promise((resolve, reject) => {
                    fb.afterLoaded().then( function() {
                        fb.auth.signInWithEmailAndPassword(options.email,options.password).then((cred) => {
                            fb.uid = cred.user.uid;
                            resolve(fb.uid,_def);
                        }).catch(err => reject(err.message));
                    });
                });
            }
        }
        //Service not supported or Login options not supported
        return new Promise((resolve, reject) => {
            reject("Login not handled");
        });
    },
    logoutPromise : function() {
        if( this.def.firebase ) {
            var obj = this.def.firebase;
            return new Promise((resolve, reject) => {
                if( obj ) {
                    obj.afterLoaded()
                    .then( function () {
                            obj.auth.signOut().then(function() {

								//obj.dialogObject.ajaxCallback('','','xbLogout');
								resolve();
							});
                        })
                    .catch(function(){ reject('Logout not handled 2');});
                } else {
                    reject("Logout not handled");
                }
            });
        }
        return new Promise((resolve, reject) => { reject("Login not handled");});
    }
});
