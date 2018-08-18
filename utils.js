export const Lorem = () =>
  <>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris fringilla viverra facilisis. Sed non ipsum metus. Morbi eleifend felis in maximus placerat. Proin gravida lacus risus, et convallis lectus venenatis sit amet. Mauris non erat felis. Nullam gravida non tortor vel sodales. In euismod est vitae neque dapibus, et elementum nunc porta. Aenean lobortis neque ut ligula pellentesque consequat vel at enim. Ut sem ipsum, malesuada at ex vel, varius ornare justo. Suspendisse neque urna, accumsan id malesuada eget, mattis et erat. Vivamus mi metus, placerat non convallis at, efficitur ut purus. Maecenas ut est sed lectus lobortis molestie. Nulla bibendum efficitur mollis. Sed nulla turpis, ullamcorper in tellus et, sodales tristique sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc id dictum lorem.</p>

    <p>Vivamus vestibulum tempus purus, ut luctus nulla maximus nec. Proin in faucibus diam. Nulla vel elementum dui. Proin sit amet placerat nisl. Nam tristique venenatis ipsum quis porta. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut scelerisque ligula a gravida convallis. Fusce eget mauris magna. Nam pharetra tempus ex, ut dictum arcu vestibulum ac. In quis odio eget sapien tempor fermentum id sed justo. Vivamus bibendum pellentesque ullamcorper. Donec gravida euismod ligula ultrices iaculis. Curabitur porta odio at urna faucibus porttitor. Mauris viverra elit arcu, non faucibus velit lobortis ac.</p>

    <p>Fusce vel purus sed ante elementum ornare convallis a nisl. Nunc et tincidunt nulla. Praesent congue felis ut enim accumsan semper. Quisque laoreet vel odio at interdum. Quisque imperdiet sem nisi. Phasellus ac pharetra justo, et eleifend diam. Quisque vel faucibus elit. Integer posuere quis est in aliquam. Phasellus aliquet ante vehicula mauris ullamcorper egestas. Donec suscipit dapibus augue sit amet tincidunt.</p>

    <p>Vestibulum iaculis vitae mi suscipit luctus. Suspendisse eleifend vestibulum sem, ac volutpat nibh. Suspendisse sodales, ligula in gravida iaculis, ipsum libero mollis risus, eu egestas massa tortor quis diam. Aliquam eget malesuada nisi. Mauris eu enim sed turpis posuere congue vitae a est. Maecenas interdum sem sit amet congue aliquet. Proin vitae purus sed turpis dignissim euismod. Nullam eu fringilla ligula, vel posuere tellus. Duis condimentum mattis nulla, eget aliquam dui vestibulum at. Vestibulum porta sit amet nulla nec fringilla. Integer dapibus quam at tortor vulputate, quis facilisis ligula finibus.</p>

    <p>Nam erat dui, bibendum ut ipsum at, posuere placerat ante. Curabitur molestie dui quis odio scelerisque, in dapibus mi maximus. Cras imperdiet tempor ullamcorper. Mauris gravida viverra sem ut vehicula. Curabitur ut justo vitae justo hendrerit tempus. Nulla ac tortor libero. Morbi egestas elementum libero in hendrerit. Pellentesque vulputate diam sed consequat dictum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum in sem tincidunt, laoreet nibh et, dapibus ex. Curabitur mattis ultricies dui, non posuere nisi faucibus sit amet. Aenean condimentum tortor egestas nibh venenatis, suscipit suscipit nulla efficitur.</p>
  </>



export const AbsolutePosition = ({ children, right, top, left, buttom}) =>
   <div style={{ position: "absolute", right, left, top,left}}>
      {children}
   </div>

export const Padding = ({ children, top, left, right, bottom }) =>
   <div style={{
      paddingTop: top,
      paddingLeft: left,
      paddingRight: right,
      paddingBottom: bottom,
   }}>
      {children}
   </div>

export const Margin = ({ children, top, left, right, bottom }) =>
   <div style={{
      marginTop: top,
      marginLeft: left,
      marginRight: right,
      marginBottom: bottom,
   }}>
      {children}
   </div>
