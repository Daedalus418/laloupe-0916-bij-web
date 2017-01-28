import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import token from '../../token.js';

const hashCode = (s) => s.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    a & a
}, 0);

const userSchema = new mongoose.Schema({
    last_name: {
        type: String,
        required: [true, 'Un nom est requis']
    },
    first_name: {
      type: String,
      required: [true, 'Un prénom est requis']
    },
    email: {
        type: String,
        required: [true, 'Une adresse mail est requise'],
        validate: [function(email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        }, 'Entrez une adresse mail valide'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Entrez une adresse mail valide'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Définissez un mot de passe']
    },
    bij: {
      type: String,
      required: [true, 'Entrez un nom de structure (BIJ, UNIJ,...)']
    },
    number: {
      type: Number,
      required: [true, 'Entrez un numéro de département']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.comparePassword = function(pwd, cb) {
    bcrypt.compare(pwd, this.password, function(err, isMatch) {
        if (err) cb(err);
        cb(null, isMatch);
    });
};

let model = mongoose.model('User', userSchema);

export default class User {

    connect(req, res) {
        if (!req.body.email) {
            res.status(400).send('Entrez une adresse mail s\'il vous plait');
        } else if (!req.body.password) {
            res.status(400).send('Entrez un mot de passe s\'il vous plait');
        } else {
            model.findOne({
                email: req.body.email
            }, (err, user) => {
                if (err || !user) {
                    res.sendStatus(403);
                } else {
                    user.comparePassword(req.body.password, (err, isMatch) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            if (isMatch) {
                                user.password = null;
                                let tk = jsonwebtoken.sign(user, token, {
                                    expiresIn: "2h"
                                });
                                res.json({
                                    success: true,
                                    user: user,
                                    token: tk
                                });
                            } else {
                                res.status(400).send('Mot de passe incorrect');
                            }
                        };
                    });
                };
            });
        }
    }

    findAll(req, res) {
        model.find({}, {
            password: 0
        }, (err, users) => {
            if (err || !users) {
                res.sendStatus(403);
            } else {
                res.json(users);
            }
        });
    }

    findById(req, res) {
        model.findById(req.params.id, {
            password: 0
        }, (err, user) => {
            if (err || !user) {
                res.sendStatus(403);
            } else {
                res.json(user);
            }
        });
    }

    create(req, res) {
        if (req.body.password) {
            var salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }
        model.create(req.body,
            (err, user) => {
                if (err || !user) {
                    if (err.code === 11000 || err.code === 11001) {
                        err.message = "L'email " + req.body.email + " existe déjà";
                    }
                    res.status(500).send(err);
                } else {
                    let tk = jsonwebtoken.sign(user, token, {
                        expiresIn: "24h"
                    });
                    res.json({
                        success: true,
                        user: user,
                        token: tk
                    });
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, req.body, (err, user) => {
            if (err || !user) {
                res.status(500).send(err.message);
            } else {
                let tk = jsonwebtoken.sign(user, token, {
                    expiresIn: "24h"
                });
                res.json({
                    success: true,
                    user: user,
                    token: tk
                });
            }
        });
    }

    delete(req, res) {
        model.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.sendStatus(200);
            }
        })
    }
}
