import React from "react";
import styled from "@emotion/styled";

import mediaqueries from "@styles/media";

import { Icon } from '@types';

const Logo: Icon = ({ fill = "white" }) => {
  return (
    <LogoContainer>
      <svg
        height="23"
        viewBox="-1538 -129 3460 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="Logo__Desktop"
      >
    <g stroke="none" fill={fill} transform="translate(-1538.000000, -129.000000)">
      <path d="M418.489,300.742 C389.54,312.881 378.724,325.169 371.577,333.275 C366.158,339.44 364.11,341.744 339.364,341.744 L332.815,341.744 C330.618,333.659 326.692,326.043 321.146,319.472 C310.138,306.523 294.074,299.077 277.071,299.077 L235.066,299.077 C218.063,299.077 202.021,306.522 191.013,319.472 C185.445,326.043 181.52,333.659 179.344,341.744 L172.773,341.744 C148.026,341.744 146,339.44 140.581,333.275 C133.434,325.168 122.618,312.902 93.669,300.742 C82.81,296.198 70.288,301.254 65.744,312.155 C61.179,323.014 66.277,335.515 77.136,340.08 C97.083,348.443 102.907,355.077 108.56,361.499 C122.512,377.328 135.099,384.411 172.773,384.411 L181.114,384.411 L187.301,421.467 C191.952,449.435 215.909,469.744 244.261,469.744 L267.877,469.744 C296.25,469.744 320.208,449.435 324.837,421.488 L331.024,384.411 L339.365,384.411 C377.04,384.411 389.626,377.328 403.6,361.478 C409.232,355.078 415.077,348.443 434.981,340.081 C445.861,335.516 450.96,323.014 446.416,312.156 C441.87,301.275 429.283,296.219 418.489,300.742 Z"></path>
      <path d="M495.218,66.378 C489.543,50.25 477.49,37.343 462.151,31.007 C391.58,1.652 263.538,0.522 258.482,0.5 L249.245,0.415 C198.109,0.415 103.837,4.554 46.92,32.308 C32.84,39.177 22.195,51.231 17.032,66.121 C4.851,100.66 -11.939,166.046 12.573,216.03 C22.237,235.721 38.834,250.739 59.314,258.27 C74.034,263.689 104.434,272.777 142.749,272.777 C150.877,272.777 159.005,272.393 167.069,271.582 C189.682,269.321 211.954,260.169 231.453,245.107 L234.866,242.483 L236.978,238.728 C243.442,227.293 250.183,216.221 256.093,206.941 C261.981,216.221 268.722,227.293 275.208,238.728 L277.299,242.483 L280.712,245.107 C300.211,260.168 322.483,269.32 345.096,271.582 C353.139,272.393 361.288,272.777 369.437,272.777 C407.773,272.777 438.152,263.689 452.808,258.27 C473.309,250.739 489.928,235.742 499.571,216.051 C524.082,166.133 507.336,100.832 495.218,66.378 Z"></path>
    </g>
    <path d="M-902.2,243.2 C-896.333304,245.066676 -890.200032,246.533328 -883.8,247.6 C-878.46664,248.93334 -872.400034,249.999996 -865.6,250.8 C-858.799966,251.600004 -851.933368,252 -845,252 C-832.733272,252 -826.6,247.466712 -826.6,238.4 C-826.6,234.933316 -828.466648,231.400018 -832.2,227.8 C-835.933352,224.199982 -840.666638,220.200022 -846.4,215.8 C-852.133362,211.399978 -858.266634,206.53336 -864.8,201.2 C-871.333366,195.86664 -877.466638,189.733368 -883.2,182.8 C-888.933362,175.866632 -893.666648,168.06671 -897.4,159.4 C-901.133352,150.73329 -903,140.800056 -903,129.6 C-903,117.066604 -900.733356,106.000048 -896.2,96.4 C-891.666644,86.799952 -885.40004,78.800032 -877.4,72.4 C-869.39996,65.999968 -860.000054,61.13335 -849.2,57.8 C-838.399946,54.46665 -826.866728,52.8 -814.6,52.8 C-808.199968,52.8 -801.800032,53.13333 -795.4,53.8 C-788.999968,54.46667 -783.266692,55.066664 -778.2,55.6 C-772.333304,56.400004 -766.600028,57.199996 -761,58 L-761,132.8 C-763.133344,132.533332 -765.53332,132.266668 -768.2,132 C-770.333344,131.733332 -772.73332,131.466668 -775.4,131.2 C-778.06668,130.933332 -780.866652,130.8 -783.8,130.8 C-785.400008,130.8 -787.399988,130.866666 -789.8,131 C-792.200012,131.133334 -794.466656,131.466664 -796.6,132 C-798.733344,132.533336 -800.599992,133.46666 -802.2,134.8 C-803.800008,136.13334 -804.6,137.999988 -804.6,140.4 C-804.6,142.533344 -802.800018,145.199984 -799.2,148.4 C-795.599982,151.600016 -791.200026,155.333312 -786,159.6 C-780.799974,163.866688 -775.066698,168.799972 -768.8,174.4 C-762.533302,180.000028 -756.800026,186.399964 -751.6,193.6 C-746.399974,200.800036 -742.000018,208.933288 -738.4,218 C-734.799982,227.066712 -733,237.199944 -733,248.4 C-733,260.133392 -734.866648,271.133282 -738.6,281.4 C-742.333352,291.666718 -748.133294,300.599962 -756,308.2 C-763.866706,315.800038 -773.933272,321.799978 -786.2,326.2 C-798.466728,330.600022 -812.999916,332.8 -829.8,332.8 C-839.933384,332.8 -849.33329,332.333338 -858,331.4 C-866.66671,330.466662 -874.3333,329.33334 -881,328 C-888.733372,326.66666 -895.799968,325.066676 -902.2,323.2 L-902.2,243.2 Z M-721,192.8 C-721,173.599904 -717.33337,155.466752 -710,138.4 C-702.66663,121.333248 -692.66673,106.46673 -680,93.8 C-667.33327,81.13327 -652.466752,71.13337 -635.4,63.8 C-618.333248,56.46663 -600.200096,52.8 -581,52.8 C-561.799904,52.8 -543.666752,56.46663 -526.6,63.8 C-509.533248,71.13337 -494.66673,81.13327 -482,93.8 C-469.33327,106.46673 -459.33337,121.333248 -452,138.4 C-444.66663,155.466752 -441,173.599904 -441,192.8 C-441,212.000096 -444.66663,230.133248 -452,247.2 C-459.33337,264.266752 -469.33327,279.13327 -482,291.8 C-494.66673,304.46673 -509.533248,314.46663 -526.6,321.8 C-543.666752,329.13337 -561.799904,332.8 -581,332.8 C-600.200096,332.8 -618.333248,329.13337 -635.4,321.8 C-652.466752,314.46663 -667.33327,304.46673 -680,291.8 C-692.66673,279.13327 -702.66663,264.266752 -710,247.2 C-717.33337,230.133248 -721,212.000096 -721,192.8 Z M-637,192.8 C-637,200.533372 -635.533348,207.799966 -632.6,214.6 C-629.666652,221.400034 -625.666692,227.333308 -620.6,232.4 C-615.533308,237.466692 -609.600034,241.466652 -602.8,244.4 C-595.999966,247.333348 -588.733372,248.8 -581,248.8 C-573.266628,248.8 -566.000034,247.333348 -559.2,244.4 C-552.399966,241.466652 -546.466692,237.466692 -541.4,232.4 C-536.333308,227.333308 -532.333348,221.400034 -529.4,214.6 C-526.466652,207.799966 -525,200.533372 -525,192.8 C-525,185.066628 -526.466652,177.800034 -529.4,171 C-532.333348,164.199966 -536.333308,158.266692 -541.4,153.2 C-546.466692,148.133308 -552.399966,144.133348 -559.2,141.2 C-566.000034,138.266652 -573.266628,136.8 -581,136.8 C-588.733372,136.8 -595.999966,138.266652 -602.8,141.2 C-609.600034,144.133348 -615.533308,148.133308 -620.6,153.2 C-625.666692,158.266692 -629.666652,164.199966 -632.6,171 C-635.533348,177.800034 -637,185.066628 -637,192.8 Z M-419,59.2 L-349,59.2 L-275.4,162 L-275.4,59.2 L-191.8,59.2 L-191.8,326 L-262.2,326 L-335.4,223.6 L-335.4,326 L-419,326 L-419,59.2 Z M6.2,150 C1.399976,145.733312 -4.599964,142.466678 -11.8,140.2 C-19.000036,137.933322 -26.066632,136.8 -33,136.8 C-40.733372,136.8 -47.799968,138.199986 -54.2,141 C-60.600032,143.800014 -66.13331,147.666642 -70.8,152.6 C-75.46669,157.533358 -79.13332,163.466632 -81.8,170.4 C-84.46668,177.333368 -85.8,184.79996 -85.8,192.8 C-85.8,200.80004 -84.333348,208.266632 -81.4,215.2 C-78.466652,222.133368 -74.466692,228.066642 -69.4,233 C-64.333308,237.933358 -58.400034,241.799986 -51.6,244.6 C-44.799966,247.400014 -37.533372,248.8 -29.8,248.8 C-20.733288,248.8 -12.466704,246.866686 -5,243 C2.466704,239.133314 8.86664,233.8667 14.2,227.2 L-9.8,227.2 L-9.8,171.2 L93,171.2 L93,260 C86.866636,270.933388 79.533376,280.866622 71,289.8 C62.466624,298.733378 52.933386,306.399968 42.4,312.8 C31.866614,319.200032 20.466728,324.133316 8.2,327.6 C-4.066728,331.066684 -16.733268,332.8 -29.8,332.8 C-49.000096,332.8 -67.133248,329.200036 -84.2,322 C-101.266752,314.799964 -116.13327,304.933396 -128.8,292.4 C-141.46673,279.866604 -151.46663,265.066752 -158.8,248 C-166.13337,230.933248 -169.8,212.533432 -169.8,192.8 C-169.8,173.599904 -166.333368,155.466752 -159.4,138.4 C-152.466632,121.333248 -142.933394,106.46673 -130.8,93.8 C-118.666606,81.13327 -104.26675,71.13337 -87.6,63.8 C-70.93325,56.46663 -53.000096,52.8 -33.8,52.8 C-18.866592,52.8 -5.933388,54.266652 5,57.2 C15.933388,60.133348 25.133296,63.466648 32.6,67.2 C41.400044,71.466688 48.733304,76.133308 54.6,81.2 L6.2,150 Z" id="song" stroke="none" fill={fill}></path>
    <path d="M227,192.8 C227,171.46656 230.733296,152.200086 238.2,135 C245.666704,117.799914 255.799936,103.066728 268.6,90.8 C281.400064,78.533272 296.333248,69.133366 313.4,62.6 C330.466752,56.066634 348.599904,52.8 367.8,52.8 C383.000076,52.8 396.533274,54.266652 408.4,57.2 C420.266726,60.133348 430.466624,63.466648 439,67.2 C448.866716,71.466688 457.399964,76.133308 464.6,81.2 L422.6,155.2 C418.333312,151.999984 413.666692,148.933348 408.6,146 C404.066644,143.866656 398.666698,141.80001 392.4,139.8 C386.133302,137.79999 379.00004,136.8 371,136.8 C362.733292,136.8 355.133368,138.266652 348.2,141.2 C341.266632,144.133348 335.200026,148.133308 330,153.2 C324.799974,158.266692 320.733348,164.199966 317.8,171 C314.866652,177.800034 313.4,185.066628 313.4,192.8 C313.4,200.533372 314.933318,207.799966 318,214.6 C321.066682,221.400034 325.26664,227.333308 330.6,232.4 C335.93336,237.466692 342.199964,241.466652 349.4,244.4 C356.600036,247.333348 364.466624,248.8 373,248.8 C381.533376,248.8 389.1333,247.733344 395.8,245.6 C402.4667,243.466656 408.066644,241.06668 412.6,238.4 C417.93336,235.466652 422.59998,232.00002 426.6,228 L468.6,302 C461.399964,307.866696 452.866716,313.066644 443,317.6 C434.466624,321.333352 424.20006,324.799984 412.2,328 C400.19994,331.200016 386.466744,332.8 371,332.8 C350.199896,332.8 331.000088,329.400034 313.4,322.6 C295.799912,315.799966 280.600064,306.266728 267.8,294 C254.999936,281.733272 245.000036,267.000086 237.8,249.8 C230.599964,232.599914 227,213.600104 227,192.8 Z M478.6,59.2 L563.8,59.2 L563.8,150 L611.4,150 L611.4,59.2 L697,59.2 L697,326 L611.4,326 L611.4,227.2 L563.8,227.2 L563.8,326 L478.6,326 L478.6,59.2 Z M725,59.2 L882.2,59.2 L882.2,129.2 L810.2,129.2 L810.2,158.8 L881,158.8 L881,225.2 L810.2,225.2 L810.2,256 L885,256 L885,326 L725,326 L725,59.2 Z M909,59.2 L979,59.2 L1052.6,162 L1052.6,59.2 L1136.2,59.2 L1136.2,326 L1065.8,326 L992.6,223.6 L992.6,326 L909,326 L909,59.2 Z M1142.2,59.2 L1232.6,59.2 L1263.4,152.4 L1294.2,59.2 L1352.6,59.2 L1383.4,152.4 L1414.2,59.2 L1504.6,59.2 L1416.6,326 L1350.2,326 L1323.4,245.2 L1296.6,326 L1230.2,326 L1142.2,59.2 Z M1510.6,59.2 L1667.8,59.2 L1667.8,129.2 L1595.8,129.2 L1595.8,158.8 L1666.6,158.8 L1666.6,225.2 L1595.8,225.2 L1595.8,256 L1670.6,256 L1670.6,326 L1510.6,326 L1510.6,59.2 Z M1694.6,59.2 L1764.6,59.2 L1838.2,162 L1838.2,59.2 L1921.8,59.2 L1921.8,326 L1851.4,326 L1778.2,223.6 L1778.2,326 L1694.6,326 L1694.6,59.2 Z" id="chenwen" stroke="none" fill="#8B8B8B"></path>
</svg>

      <svg
        height="23"
        viewBox="-1538 -129 3460 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="Logo__Mobile"
      >
        <g stroke="none" fill={fill} transform="translate(-1538.000000, -129.000000)">
          <path d="M418.489,300.742 C389.54,312.881 378.724,325.169 371.577,333.275 C366.158,339.44 364.11,341.744 339.364,341.744 L332.815,341.744 C330.618,333.659 326.692,326.043 321.146,319.472 C310.138,306.523 294.074,299.077 277.071,299.077 L235.066,299.077 C218.063,299.077 202.021,306.522 191.013,319.472 C185.445,326.043 181.52,333.659 179.344,341.744 L172.773,341.744 C148.026,341.744 146,339.44 140.581,333.275 C133.434,325.168 122.618,312.902 93.669,300.742 C82.81,296.198 70.288,301.254 65.744,312.155 C61.179,323.014 66.277,335.515 77.136,340.08 C97.083,348.443 102.907,355.077 108.56,361.499 C122.512,377.328 135.099,384.411 172.773,384.411 L181.114,384.411 L187.301,421.467 C191.952,449.435 215.909,469.744 244.261,469.744 L267.877,469.744 C296.25,469.744 320.208,449.435 324.837,421.488 L331.024,384.411 L339.365,384.411 C377.04,384.411 389.626,377.328 403.6,361.478 C409.232,355.078 415.077,348.443 434.981,340.081 C445.861,335.516 450.96,323.014 446.416,312.156 C441.87,301.275 429.283,296.219 418.489,300.742 Z"></path>
          <path d="M495.218,66.378 C489.543,50.25 477.49,37.343 462.151,31.007 C391.58,1.652 263.538,0.522 258.482,0.5 L249.245,0.415 C198.109,0.415 103.837,4.554 46.92,32.308 C32.84,39.177 22.195,51.231 17.032,66.121 C4.851,100.66 -11.939,166.046 12.573,216.03 C22.237,235.721 38.834,250.739 59.314,258.27 C74.034,263.689 104.434,272.777 142.749,272.777 C150.877,272.777 159.005,272.393 167.069,271.582 C189.682,269.321 211.954,260.169 231.453,245.107 L234.866,242.483 L236.978,238.728 C243.442,227.293 250.183,216.221 256.093,206.941 C261.981,216.221 268.722,227.293 275.208,238.728 L277.299,242.483 L280.712,245.107 C300.211,260.168 322.483,269.32 345.096,271.582 C353.139,272.393 361.288,272.777 369.437,272.777 C407.773,272.777 438.152,263.689 452.808,258.27 C473.309,250.739 489.928,235.742 499.571,216.051 C524.082,166.133 507.336,100.832 495.218,66.378 Z"></path>
        </g>
        <path d="M-902.2,243.2 C-896.333304,245.066676 -890.200032,246.533328 -883.8,247.6 C-878.46664,248.93334 -872.400034,249.999996 -865.6,250.8 C-858.799966,251.600004 -851.933368,252 -845,252 C-832.733272,252 -826.6,247.466712 -826.6,238.4 C-826.6,234.933316 -828.466648,231.400018 -832.2,227.8 C-835.933352,224.199982 -840.666638,220.200022 -846.4,215.8 C-852.133362,211.399978 -858.266634,206.53336 -864.8,201.2 C-871.333366,195.86664 -877.466638,189.733368 -883.2,182.8 C-888.933362,175.866632 -893.666648,168.06671 -897.4,159.4 C-901.133352,150.73329 -903,140.800056 -903,129.6 C-903,117.066604 -900.733356,106.000048 -896.2,96.4 C-891.666644,86.799952 -885.40004,78.800032 -877.4,72.4 C-869.39996,65.999968 -860.000054,61.13335 -849.2,57.8 C-838.399946,54.46665 -826.866728,52.8 -814.6,52.8 C-808.199968,52.8 -801.800032,53.13333 -795.4,53.8 C-788.999968,54.46667 -783.266692,55.066664 -778.2,55.6 C-772.333304,56.400004 -766.600028,57.199996 -761,58 L-761,132.8 C-763.133344,132.533332 -765.53332,132.266668 -768.2,132 C-770.333344,131.733332 -772.73332,131.466668 -775.4,131.2 C-778.06668,130.933332 -780.866652,130.8 -783.8,130.8 C-785.400008,130.8 -787.399988,130.866666 -789.8,131 C-792.200012,131.133334 -794.466656,131.466664 -796.6,132 C-798.733344,132.533336 -800.599992,133.46666 -802.2,134.8 C-803.800008,136.13334 -804.6,137.999988 -804.6,140.4 C-804.6,142.533344 -802.800018,145.199984 -799.2,148.4 C-795.599982,151.600016 -791.200026,155.333312 -786,159.6 C-780.799974,163.866688 -775.066698,168.799972 -768.8,174.4 C-762.533302,180.000028 -756.800026,186.399964 -751.6,193.6 C-746.399974,200.800036 -742.000018,208.933288 -738.4,218 C-734.799982,227.066712 -733,237.199944 -733,248.4 C-733,260.133392 -734.866648,271.133282 -738.6,281.4 C-742.333352,291.666718 -748.133294,300.599962 -756,308.2 C-763.866706,315.800038 -773.933272,321.799978 -786.2,326.2 C-798.466728,330.600022 -812.999916,332.8 -829.8,332.8 C-839.933384,332.8 -849.33329,332.333338 -858,331.4 C-866.66671,330.466662 -874.3333,329.33334 -881,328 C-888.733372,326.66666 -895.799968,325.066676 -902.2,323.2 L-902.2,243.2 Z M-721,192.8 C-721,173.599904 -717.33337,155.466752 -710,138.4 C-702.66663,121.333248 -692.66673,106.46673 -680,93.8 C-667.33327,81.13327 -652.466752,71.13337 -635.4,63.8 C-618.333248,56.46663 -600.200096,52.8 -581,52.8 C-561.799904,52.8 -543.666752,56.46663 -526.6,63.8 C-509.533248,71.13337 -494.66673,81.13327 -482,93.8 C-469.33327,106.46673 -459.33337,121.333248 -452,138.4 C-444.66663,155.466752 -441,173.599904 -441,192.8 C-441,212.000096 -444.66663,230.133248 -452,247.2 C-459.33337,264.266752 -469.33327,279.13327 -482,291.8 C-494.66673,304.46673 -509.533248,314.46663 -526.6,321.8 C-543.666752,329.13337 -561.799904,332.8 -581,332.8 C-600.200096,332.8 -618.333248,329.13337 -635.4,321.8 C-652.466752,314.46663 -667.33327,304.46673 -680,291.8 C-692.66673,279.13327 -702.66663,264.266752 -710,247.2 C-717.33337,230.133248 -721,212.000096 -721,192.8 Z M-637,192.8 C-637,200.533372 -635.533348,207.799966 -632.6,214.6 C-629.666652,221.400034 -625.666692,227.333308 -620.6,232.4 C-615.533308,237.466692 -609.600034,241.466652 -602.8,244.4 C-595.999966,247.333348 -588.733372,248.8 -581,248.8 C-573.266628,248.8 -566.000034,247.333348 -559.2,244.4 C-552.399966,241.466652 -546.466692,237.466692 -541.4,232.4 C-536.333308,227.333308 -532.333348,221.400034 -529.4,214.6 C-526.466652,207.799966 -525,200.533372 -525,192.8 C-525,185.066628 -526.466652,177.800034 -529.4,171 C-532.333348,164.199966 -536.333308,158.266692 -541.4,153.2 C-546.466692,148.133308 -552.399966,144.133348 -559.2,141.2 C-566.000034,138.266652 -573.266628,136.8 -581,136.8 C-588.733372,136.8 -595.999966,138.266652 -602.8,141.2 C-609.600034,144.133348 -615.533308,148.133308 -620.6,153.2 C-625.666692,158.266692 -629.666652,164.199966 -632.6,171 C-635.533348,177.800034 -637,185.066628 -637,192.8 Z M-419,59.2 L-349,59.2 L-275.4,162 L-275.4,59.2 L-191.8,59.2 L-191.8,326 L-262.2,326 L-335.4,223.6 L-335.4,326 L-419,326 L-419,59.2 Z M6.2,150 C1.399976,145.733312 -4.599964,142.466678 -11.8,140.2 C-19.000036,137.933322 -26.066632,136.8 -33,136.8 C-40.733372,136.8 -47.799968,138.199986 -54.2,141 C-60.600032,143.800014 -66.13331,147.666642 -70.8,152.6 C-75.46669,157.533358 -79.13332,163.466632 -81.8,170.4 C-84.46668,177.333368 -85.8,184.79996 -85.8,192.8 C-85.8,200.80004 -84.333348,208.266632 -81.4,215.2 C-78.466652,222.133368 -74.466692,228.066642 -69.4,233 C-64.333308,237.933358 -58.400034,241.799986 -51.6,244.6 C-44.799966,247.400014 -37.533372,248.8 -29.8,248.8 C-20.733288,248.8 -12.466704,246.866686 -5,243 C2.466704,239.133314 8.86664,233.8667 14.2,227.2 L-9.8,227.2 L-9.8,171.2 L93,171.2 L93,260 C86.866636,270.933388 79.533376,280.866622 71,289.8 C62.466624,298.733378 52.933386,306.399968 42.4,312.8 C31.866614,319.200032 20.466728,324.133316 8.2,327.6 C-4.066728,331.066684 -16.733268,332.8 -29.8,332.8 C-49.000096,332.8 -67.133248,329.200036 -84.2,322 C-101.266752,314.799964 -116.13327,304.933396 -128.8,292.4 C-141.46673,279.866604 -151.46663,265.066752 -158.8,248 C-166.13337,230.933248 -169.8,212.533432 -169.8,192.8 C-169.8,173.599904 -166.333368,155.466752 -159.4,138.4 C-152.466632,121.333248 -142.933394,106.46673 -130.8,93.8 C-118.666606,81.13327 -104.26675,71.13337 -87.6,63.8 C-70.93325,56.46663 -53.000096,52.8 -33.8,52.8 C-18.866592,52.8 -5.933388,54.266652 5,57.2 C15.933388,60.133348 25.133296,63.466648 32.6,67.2 C41.400044,71.466688 48.733304,76.133308 54.6,81.2 L6.2,150 Z" id="song" stroke="none" fill={fill}></path>
        <path d="M227,192.8 C227,171.46656 230.733296,152.200086 238.2,135 C245.666704,117.799914 255.799936,103.066728 268.6,90.8 C281.400064,78.533272 296.333248,69.133366 313.4,62.6 C330.466752,56.066634 348.599904,52.8 367.8,52.8 C383.000076,52.8 396.533274,54.266652 408.4,57.2 C420.266726,60.133348 430.466624,63.466648 439,67.2 C448.866716,71.466688 457.399964,76.133308 464.6,81.2 L422.6,155.2 C418.333312,151.999984 413.666692,148.933348 408.6,146 C404.066644,143.866656 398.666698,141.80001 392.4,139.8 C386.133302,137.79999 379.00004,136.8 371,136.8 C362.733292,136.8 355.133368,138.266652 348.2,141.2 C341.266632,144.133348 335.200026,148.133308 330,153.2 C324.799974,158.266692 320.733348,164.199966 317.8,171 C314.866652,177.800034 313.4,185.066628 313.4,192.8 C313.4,200.533372 314.933318,207.799966 318,214.6 C321.066682,221.400034 325.26664,227.333308 330.6,232.4 C335.93336,237.466692 342.199964,241.466652 349.4,244.4 C356.600036,247.333348 364.466624,248.8 373,248.8 C381.533376,248.8 389.1333,247.733344 395.8,245.6 C402.4667,243.466656 408.066644,241.06668 412.6,238.4 C417.93336,235.466652 422.59998,232.00002 426.6,228 L468.6,302 C461.399964,307.866696 452.866716,313.066644 443,317.6 C434.466624,321.333352 424.20006,324.799984 412.2,328 C400.19994,331.200016 386.466744,332.8 371,332.8 C350.199896,332.8 331.000088,329.400034 313.4,322.6 C295.799912,315.799966 280.600064,306.266728 267.8,294 C254.999936,281.733272 245.000036,267.000086 237.8,249.8 C230.599964,232.599914 227,213.600104 227,192.8 Z M478.6,59.2 L563.8,59.2 L563.8,150 L611.4,150 L611.4,59.2 L697,59.2 L697,326 L611.4,326 L611.4,227.2 L563.8,227.2 L563.8,326 L478.6,326 L478.6,59.2 Z M725,59.2 L882.2,59.2 L882.2,129.2 L810.2,129.2 L810.2,158.8 L881,158.8 L881,225.2 L810.2,225.2 L810.2,256 L885,256 L885,326 L725,326 L725,59.2 Z M909,59.2 L979,59.2 L1052.6,162 L1052.6,59.2 L1136.2,59.2 L1136.2,326 L1065.8,326 L992.6,223.6 L992.6,326 L909,326 L909,59.2 Z M1142.2,59.2 L1232.6,59.2 L1263.4,152.4 L1294.2,59.2 L1352.6,59.2 L1383.4,152.4 L1414.2,59.2 L1504.6,59.2 L1416.6,326 L1350.2,326 L1323.4,245.2 L1296.6,326 L1230.2,326 L1142.2,59.2 Z M1510.6,59.2 L1667.8,59.2 L1667.8,129.2 L1595.8,129.2 L1595.8,158.8 L1666.6,158.8 L1666.6,225.2 L1595.8,225.2 L1595.8,256 L1670.6,256 L1670.6,326 L1510.6,326 L1510.6,59.2 Z M1694.6,59.2 L1764.6,59.2 L1838.2,162 L1838.2,59.2 L1921.8,59.2 L1921.8,326 L1851.4,326 L1778.2,223.6 L1778.2,326 L1694.6,326 L1694.6,59.2 Z" id="chenwen" stroke="none" fill="#8B8B8B"></path>
      </svg>
    </LogoContainer>
  );
};

export default Logo;

const LogoContainer = styled.div`
  .Logo__Mobile {
    display: none;
  }
  ${mediaqueries.tablet`
    .Logo__Desktop {
      display: none;
    }
    
    .Logo__Mobile{
      display: block;
    }
  `}
`;