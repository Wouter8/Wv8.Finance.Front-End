import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Gemaakt door <b><a href="https://woutervanacht.com" target="_blank">Wouter van Acht</a></b></span>
    <div class="socials">
      <a href="mailto:wouter@woutervanacht.com" target="_blank">
        <i class="control-icon ion ion-email"></i>
      </a>
      <a href="https://www.facebook.com/quizorganizer" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://www.linkedin.com/in/wouter-van-acht/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
