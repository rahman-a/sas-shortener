var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';
var __dirname = path.resolve();
var filePath = path.join(__dirname, 'server', 'data', 'urls.json');
var userFilePath = path.join(__dirname, 'server', 'data', 'users.json');
// create a function to shorten a url
export var shortenUrl = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var destination, short, newUrl, urls, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                destination = url.destination, short = url.short;
                if (!destination || !short) {
                    throw new Error('Missing destination or short');
                }
                newUrl = {
                    destination: destination,
                    short: short,
                    clicks: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                urls = [];
                if (!fs.existsSync(filePath)) return [3 /*break*/, 2];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _b.apply(_a, [_c.sent()]);
                _c.label = 2;
            case 2: return [4 /*yield*/, fsPromise.writeFile(filePath, JSON.stringify(__spreadArray(__spreadArray([], urls, true), [newUrl], false)))];
            case 3:
                _c.sent();
                return [2 /*return*/, newUrl];
        }
    });
}); };
export var getOneUrl = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var destination, short, urls, parsedUrls, foundUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                destination = url.destination, short = url.short;
                return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _a.sent();
                parsedUrls = JSON.parse(urls);
                foundUrl = undefined;
                if (url.destination) {
                    foundUrl = parsedUrls.find(function (url) { return url.destination === destination; });
                }
                if (url.short) {
                    foundUrl = parsedUrls.find(function (url) { return url.short === short; });
                }
                return [2 /*return*/, foundUrl];
        }
    });
}); };
// create a function to get all urls
export var getAllUrls = function (sort) { return __awaiter(void 0, void 0, void 0, function () {
    var urlsPerPage, skip, urls, parsedUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!sort.createdAt)
                    sort.createdAt = 'asc';
                if (!sort.page)
                    sort.page = 1;
                urlsPerPage = 5;
                skip = (sort.page - 1) * urlsPerPage;
                return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _a.sent();
                parsedUrls = JSON.parse(urls);
                parsedUrls = parsedUrls.slice(skip, skip + urlsPerPage);
                // sort urls based on date
                if (sort.createdAt === 'asc') {
                    parsedUrls.sort(function (a, b) {
                        var dateA = new Date(a.createdAt);
                        var dateB = new Date(b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    });
                }
                if (sort.createdAt === 'desc') {
                    parsedUrls.sort(function (a, b) {
                        var dateA = new Date(a.createdAt);
                        var dateB = new Date(b.createdAt);
                        return dateA.getTime() - dateB.getTime();
                    });
                }
                if (sort.clicks === 'asc') {
                    parsedUrls.sort(function (a, b) {
                        return a.clicks - b.clicks;
                    });
                }
                if (sort.clicks === 'desc') {
                    parsedUrls.sort(function (a, b) {
                        return b.clicks - a.clicks;
                    });
                }
                return [2 /*return*/, parsedUrls];
        }
    });
}); };
// create a function to update a url clicks count
export var updateUrlClicks = function (short) { return __awaiter(void 0, void 0, void 0, function () {
    var urls, parsedUrls, foundUrl, newUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _a.sent();
                parsedUrls = JSON.parse(urls);
                foundUrl = parsedUrls.find(function (url) { return url.short === short; });
                if (!foundUrl)
                    throw new Error('Url not found');
                newUrls = parsedUrls.map(function (url) {
                    if (url.short === short) {
                        url.clicks = url.clicks + 1;
                        url.updatedAt = new Date().toISOString();
                        foundUrl = url;
                    }
                    return url;
                });
                return [4 /*yield*/, fsPromise.writeFile(filePath, JSON.stringify(newUrls))];
            case 2:
                _a.sent();
                return [2 /*return*/, foundUrl];
        }
    });
}); };
// create a function to delete a url
export var deleteUrl = function (short) { return __awaiter(void 0, void 0, void 0, function () {
    var urls, parsedUrls, foundUrl, newUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _a.sent();
                parsedUrls = JSON.parse(urls);
                foundUrl = parsedUrls.find(function (url) { return url.short === short; });
                if (!foundUrl)
                    throw new Error('Url not found');
                newUrls = parsedUrls.filter(function (url) { return url.short !== short; });
                return [4 /*yield*/, fsPromise.writeFile(filePath, JSON.stringify(newUrls))];
            case 2:
                _a.sent();
                return [2 /*return*/, foundUrl];
        }
    });
}); };
// create a function to filter urls bases on destination , short and clicks
export var filterUrls = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var destination, short, clicks, urls, parsedUrls, filteredUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                destination = url.destination, short = url.short, clicks = url.clicks;
                return [4 /*yield*/, fsPromise.readFile(filePath, 'utf-8')];
            case 1:
                urls = _a.sent();
                parsedUrls = JSON.parse(urls);
                filteredUrls = parsedUrls.filter(function (url) {
                    if (destination && short && clicks) {
                        return (url.destination.includes(destination) &&
                            url.short.includes(short) &&
                            url.clicks === Number(clicks));
                    }
                    if (destination && short) {
                        return (url.destination.includes(destination) && url.short.includes(short));
                    }
                    if (destination && clicks) {
                        return (url.destination.includes(destination) && url.clicks === Number(clicks));
                    }
                    if (short && clicks) {
                        return url.short.includes(short) && url.clicks === Number(clicks);
                    }
                    if (destination) {
                        return url.destination.includes(destination);
                    }
                    if (short) {
                        return url.short.includes(short);
                    }
                    if (clicks) {
                        return url.clicks === Number(clicks);
                    }
                });
                return [2 /*return*/, filteredUrls];
        }
    });
}); };
export var getUser = function (member) { return __awaiter(void 0, void 0, void 0, function () {
    var users, parsedUsers, foundUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fsPromise.readFile(userFilePath, 'utf-8')];
            case 1:
                users = _a.sent();
                parsedUsers = JSON.parse(users);
                foundUser = member.email
                    ? parsedUsers.find(function (user) { return user.email === member.email; })
                    : parsedUsers.find(function (user) { return user._id === member._id; });
                return [2 /*return*/, foundUser];
        }
    });
}); };
