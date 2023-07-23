import {decodeCallData, getPrettyABI} from './utils.js'


function createArgsHtml(args) {
  let html = ''
  for (let i = 0; i < args.length; i++) {
    html += `
    <li><span class="u-label u-label--xs u-label--secondary rounded mr-1 d-inline">${i}</span>&nbsp;<span
      class="text-monospace text-break">${args[i]}</span>
    </li>
    `
  }
  return html
}

async function getInternalExecutionHtml(executeData) {
  let html = ''
  let {decodedParams, abi, iface} = await decodeCallData(executeData)

  if (iface !== null) {
    let innerHtml = ''

    for (let i = 0; i < iface.fragments[0].inputs.length; i++) {
      if (iface.fragments[0].inputs[i].type === 'bytes') {
        html += await getInternalExecutionHtml(decodedParams[i])
      }
    }

    for (let i = 0; i < decodedParams.length; i++) {
      innerHtml += `
        <li class="d-lg-flex"><span class="text-secondary rounded mr-1">${iface.fragments[0].inputs[i].type}:</span><span class="text-monospace text-break d-block d-sm-inline-block" data-toggle="tooltip" title="">${decodedParams[i]}</span></li>
      `
    }

    html = `
      <div class="media">
      <div class="mt-1 mr-3"><span class="btn btn-icon btn-soft-success rounded-circle"><span
        class="btn-icon__inner">
        [internal]
        </span></span>
      </div>
      <div class="media-body">
            <dl class="row align-items-baseline mb-3">
        <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="mb-0">Name</h6></dt>
        <dd class="col-md-10 mb-0">
          <p class="text-secondary text-monospace mb-0">
          <span id="funcname_0"
             style="display: inline-block; margin-bottom:6px"
             data-title="ABI Event Input">${getPrettyABI(abi[0])}
          </span>
          </p>
        </dd>
      </dl>
      <dl class="row align-items-baseline mb-0">
         <dt class="col-md-2 col-lg-1 text-md-right">
            <h6 class="font-italic mb-0">Data</h6>
         </dt>
         <dd class="col-md-10 mb-0">
            <ul class="list-unstyled list-xs-space bg-light rounded p-4 mb-2 d-md-flex justify-content-between ">
               <span id="event_raw_data_1" class="text-monospace text-break" style="display:none">${executeData}</span>
               <div id="event_dec_data_1">
               ${innerHtml}
               </div>
            </ul>
         </dd>
      </dl>
      </div>
      </div>
    ` + html
  }


  return html
}

async function createOpHtml(op, beneficiary, index) {
  let beneficiaryHtml = `
      <div class="row align-items-center mb-4">
        <div class="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
            <i class="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1" data-container="body" data-toggle="popover" data-placement="top" data-original-title="" title="" data-content="Beneficiary."></i>
            Beneficiary:
        </div>
        <div class="col-md-9">
          <span id="spanFromAdd" style="display:none;">${beneficiary}</span><a id="addressCopy" class="mr-1" href="/address/${beneficiary}">${beneficiary}</a>
          <a class="js-clipboard text-secondary ml-1" href="javascript:;" data-toggle="tooltip" title="" data-content-target="#spanFromAdd" data-class-change-target="#fromAddressLinkIcon" data-success-text="Copied" data-default-class="far fa-copy" data-success-class="far fa-check-circle" data-original-title="Copy From Address to clipboard">
          <span id="fromAddressLinkIcon" class="far fa-copy"></span></a>
        </div>
      </div>
  `
  let {decodedParams, abi, iface} = await decodeCallData(op[3])

  // executionHtml += await getInternalExecutionHtml(op[3])
  let executionHtml = ''
  for (let i = 0; i < iface.fragments[0].inputs.length; i++) {
      if (iface.fragments[0].inputs[i].type === 'bytes') {
        executionHtml += await getInternalExecutionHtml(decodedParams[i])
      }
  }

  let innerHtml = `
      <div class="media">
      <div class="mt-1 mr-3"><span class="btn btn-icon btn-soft-success rounded-circle"><span
        class="btn-icon__inner">${index}</span></span></div>
      <div class="media-body">
        <dl class="row align-items-baseline mb-3">
          <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="mb-0">Nonce</h6></dt>
          <dd class="col-md-10 mb-0">
            <p class="text-secondary text-monospace mb-0">
            <span id="funcname_0"
               style="display: inline-block; margin-bottom:6px"
               data-title="ABI Event Input">
            ${op[1]}
            </span>
            </p>
          </dd>
        </dl>
        <dl class="row align-items-baseline mb-3">
          <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="mb-0">Code</h6></dt>
          <dd class="col-md-10 mb-0">
            <p class="text-secondary text-monospace mb-0">
            <span id="funcname_0"
               style="display: inline-block; margin-bottom:6px"
               data-title="ABI Event Input">
            ${op[2]}
            </span>
            </p>
          </dd>
        </dl>
        <dl class="row align-items-baseline mb-3">
          <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="font-weight-bold mb-0">Sender</h6></dt>
          <dd class="col-md-10 mb-0">
            <a class="text-break mr-2" href="/address/${op[0]}">${op[0]}</a><span
            class="dropdown"><button class="btn btn-xss btn-custom dropdown-toggle" type="button"
                                         id="matchDropdown-0" data-toggle="dropdown" aria-haspopup="true"
                                         aria-expanded="false"><i class="fa fa-search-plus"></i></button><div
            class="dropdown-menu" aria-labelledby="matchDropdown-0">
          </dd>
        </dl>
        <dl class="row align-items-baseline mb-3">
          <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="mb-0">Name</h6></dt>
          <dd class="col-md-10 mb-0">
            <p class="text-secondary text-monospace mb-0">
            <span id="funcname_0"
               style="display: inline-block; margin-bottom:6px"
               data-title="ABI Event Input">${getPrettyABI(abi[0])}
            </span>
            </p>
          </dd>
        </dl>
        <dl class="row align-items-baseline mb-3">
          <dt class="col-md-2 col-lg-1 text-md-right"><h6 class="mb-0">Args</h6></dt>
          <dd class="col-md-10 mb-0">
            <ul class="list-unstyled list-xs-space mb-0">
              ${createArgsHtml(decodedParams)}
            </ul>
          </dd>
        </dl>
        <hr>
      </div>
      </div>
      ${executionHtml}
      <hr>
      ${beneficiaryHtml}
  `
  return innerHtml;
}


async function createOpsHtml(ops, beneficiary) {
  let innerHtml = ''
  for (let i = 0; i < ops.length; i++) {
    innerHtml += await createOpHtml(ops[i], beneficiary, i)
  }
  return `<div class="card-body">${innerHtml}</div>`

}

export default createOpsHtml;
